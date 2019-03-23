import { bot } from './bot';
import { fullQuery } from './database';

export async function guilds(req, res) {
    const ids = await fullQuery('FOR g IN guilds RETURN g.id');

    res.json(ids
        .map(id => bot.guilds.find(g => g.id === id))
        .filter(g => !!g)
        .map(({ id, name, iconURL }) => ({ id, name, icon: iconURL })));
}

export async function fetch(req, res) {
    const { guild, date, channel, user } = req.body;

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

    res.json(result);
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
