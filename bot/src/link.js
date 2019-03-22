import { RichEmbed } from 'discord.js';
import { config } from './config';
import { fetch } from './fetcher';

export default async function(guild, channel) {
    const warnEmbed = new RichEmbed()
        .setTitle("🤔 Link guild ?")
        .setDescription(
            "Are you sure to link guild '**" + guild.name +  "**' ?\n\n" +
            "**This process can take up to several hours**\n" +
            "This will make its statistics **publicly** visible on " + config.url + "stats/" + guild.id
        )
        .setColor('#00a4d6');

    const warn = await channel.send(warnEmbed);
    await warn.react('✅');
    await warn.react('❎');

    const reactions = await warn.awaitReactions((reaction, user) => {
        const name = reaction.emoji.name;
        return (name === '✅' || name === '❎') && guild.member(user).hasPermission('ADMINISTRATOR') && !user.bot;
    }, { time: 15000, max: 1 });

    await warn.delete();

    if (reactions.size === 0 || reactions.array()[0].emoji.name === '❎') {
        return;
    }

    const embed = ({ progress, max, messages, chan }) => {
        const embed = new RichEmbed();
        embed.setTitle('Processing guild stats...');
        embed.setColor('#00a4d6');
        embed.setThumbnail(guild.iconURL);
        embed.addField('Guild', guild.name);
        embed.addField('Messages fetched', messages);
        embed.addField('Channels fetched', `**${progress}** / ${max} _(${chan})_`);

        return embed;
    };

    const message = await channel.send(embed({
        progress: 0,
        max: 0,
        messages: 0,
        chan: 'En attente'
    }));
    const update = options => message.edit('', embed(options));

    const { count, duration } = await fetch(guild, update);

    await message.delete();
    await channel.send(
        new RichEmbed()
            .setTitle("✅ Guild linked")
            .setDescription("Successfully linked guild '**" + guild.name + "**' !")
            .addField('URL', `<${config.url}guild/${guild.id}>`)
            .addField('Total messages', count)
            .addField('Total fetch duration', duration)
    )
}
