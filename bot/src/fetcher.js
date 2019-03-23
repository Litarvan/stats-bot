import { db } from './database';
import logger from './logger';

export async function fetch(guild, updater)
{
    logger.info(`Fetching guild '${guild.name}' (${guild.id})...`);

    const time = new Date().getTime();

    const result = {};
    let messageCount = 0;

    const channels = guild.channels.array().filter(channel => channel.type === 'text');
    for (let i = 0; i < channels.length; i++) {
        const channel = channels[i];

        updater({
            progress: i + 1,
            max: channels.length,
            messages: messageCount,
            chan: channel.toString()
        });

        let last;
        let messages;

        do {
            const options = last ? { before: last.id } : {};
            options.max = 50;

            messages = (await channel.fetchMessages(options)).array();
            messageCount += messages.length;

            for (const message of messages) {
                const date = message.createdAt;
                const key = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

                if (!result[key]) {
                    result[key] = {};
                }

                if (!result[key][channel.id]) {
                    result[key][channel.id] = {};
                }

                if (!result[key][channel.id][message.author.id]) {
                    result[key][channel.id][message.author.id] = 0;
                }

                result[key][channel.id][message.author.id]++;
            }

            last = messages[messages.length - 1];
        } while (messages.length === 50);
    }

    await db.collection('guilds').save({
        id: guild.id,
        stats: result
    });

    const totalTime = (new Date().getTime() - time) / 1000;
    const seconds = totalTime % 60;
    const minutes = (totalTime - seconds) / 60;

    const duration = minutes + 'm' + seconds + 's';

    logger.info(`Successfully fetched guild ${messageCount} messages from guild '${guild.name}' (${guild.id}) in ${duration}...`);

    return { count: messageCount, duration };
}
