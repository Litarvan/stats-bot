/* eslint-disable no-console */
import { Client } from 'discord.js'

import logger from './logger';
import { start as httpStart } from './http';
import { config, load as configLoad } from './config';
import { login as arangoLogin, init as arangoInit } from './database';
import link from './link';

const VERSION = '1.0.0';

export const bot = new Client();

async function start () {
  logger.info(`-- Stats bot v${VERSION} --\n`);

  logger.info('--> Loading configuration...');
  configLoad();

  logger.info('--> Connecting to the database...');

  await arangoLogin();
  await arangoInit();

  logger.info('--> Connected to the database');

  logger.info('--> Starting HTTP API...');

  const port = await httpStart();
  logger.info(`--> HTTP API running on port ${port}`);

  logger.info('--> Connecting to Discord servers...');
  bot.login(config.token);

  await awaitReady(bot);

  console.log();
  logger.info(`--> Ready ! Stats bot is running on ${bot.guilds.size} Discord servers\n`);

  bot.user.setActivity(`faire des stats (v${VERSION})`);
}

bot.on('message', msg => {
  if (msg.content.toLowerCase().trim() !== config.trigger) {
    return;
  }

  if (!msg.member.hasPermission('ADMINISTRATOR')) {
    msg.channel.send('🚫 Only an administrator can link the guild');
    return;
  }

  link(msg.guild, msg.channel).catch(err => {
    logger.error('Exception during linking !');
    console.error(err);
  });
});

start().catch(err => {
  logger.error('Error during bot loading !');
  logger.error(err.toString());

  console.error(err);

  process.exit(1);
});

function awaitReady (entity) {
  return new Promise(resolve => {
    entity.on('ready', resolve)
  });
}
