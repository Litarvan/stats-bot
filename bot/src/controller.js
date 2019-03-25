import { bot } from './bot';
import { fullQuery } from './database';
import http from 'node-fetch';

export async function guilds(req, res) {
    const guilds = await (await http('http://discordapp.com/api/users/@me/guilds', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${req.token.data.token}`
        }
    })).json();

    const ids = await fullQuery('FOR g IN guilds FILTER POSITION(@guilds, g.id) RETURN g.id', {
        guilds: guilds.map(g => g.id)
    });

    res.json(ids
        .map(id => bot.guilds.find(g => g.id === id))
        .filter(g => !!g)
        .map(({ id, name, iconURL }) => ({ id, name, icon: iconURL })));
}

export async function stats(req, res) {
    const { id } = req.body;
    const guild = bot.guilds.find(g => g.id === id);

    const stats = await fetch({ guild: id });

    const users = {};
    const joined = {};
    let total = 0;

    for (const d of Object.keys(stats)) {
        const split = d.split('/');
        const date = new Date();

        date.setDate(~~split[0]);
        date.setMonth(split[1] - 1);
        date.setFullYear(~~split[2]);

        const timestamp = date.getTime();

        for (const c of Object.values(stats[d])) {
            for (const user of Object.keys(c)) {
                if (!users[user]) {
                    users[user] = 0;
                }

                const value = c[user];
                users[user] += value;
                total += value;

                if (!joined[user] || joined[user] > timestamp) {
                    joined[user] = timestamp;
                }
            }
        }
    }

    const result = [];
    for (const userID of Object.keys(users)) {
        let user = guild.members.get(userID);

        if (!user) {
            // User left discord
            continue;
        }

        result.push({
            id: user.user.id,
            name: user.displayName,
            discriminator: user.user.discriminator,
            avatar: user.user.displayAvatarURL.replace('size=2048', 'size=256'),
            messages: users[userID],
            joined: joined[userID]
        });
    }

    res.json({
        createdAt: guild.createdTimestamp,
        memberCount: guild.memberCount,
        messageCount: total,
        members: result.sort((a, b) => b.messages - a.messages)
    });
}

async function fetch({ guild, date, channel, user }) {
    let query = 'FOR g IN guilds FILTER g.id == @guild LET stats = g.stats FOR d IN ATTRIBUTES(stats) ';
    const params = { guild };

    if (date) {
        query += 'FILTER d == @date ';
        params.date = date;
    }

    query += 'LET channels = stats[d] RETURN { [d]: (FOR c IN ATTRIBUTES(channels) ';

    if (channel) {
        query += 'FILTER c == @channel ';
        params.channel = channel;
    }

    query += 'LET users = channels[c] RETURN { [c]: (FOR u IN ATTRIBUTES(users) ';

    if (user) {
        query += 'FILTER u == @user ';
        params.user = user;
    }

    query += 'RETURN { [u]: users[u] } )} )}';

    let result = await fullQuery(query, params);
    result = normalize(result, 2);

    return result;
}

function normalize(array, deep) {
    const result = {};

    for (const obj of array) {
        const key = Object.keys(obj)[0];
        const value = deep ? normalize(obj[key], deep - 1) : obj[key];

        if (!(typeof value === 'object' && Object.keys(value).length === 0)) {
            result[key] = value;
        }
    }

    return result;
}
