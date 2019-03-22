/* eslint-disable no-console */
import { Client } from 'discord.js'

import logger from './logger';
import { start as httpStart } from './http';
import { config, load as configLoad } from './config';
import { login as arangoLogin, init as arangoInit } from './database';

const VERSION = '1.0.0';

const bot = new Client();

async function start () {
  logger.info(`-- Stats bot v${VERSION} --\n`);

  logger.info('--> Chargement de la configuration');
  configLoad();

  logger.info('--> Connexion à la base de donnée...');

  await arangoLogin();
  await arangoInit();

  logger.info('--> Connecté à la base de donnée');

  if (config.api.enabled) {
    logger.info('--> Démarrage de l\'API HTTP...');

    const port = await httpStart();
    logger.info(`--> API HTTP démarrée sur le port ${port}`);
  }

  logger.info('--> Connexion aux serveurs Discord...');
  bot.login(config.token);

  await awaitReady(bot);

  console.log();
  logger.info(`--> Prêt ! Stats bot est opérationnel sur ${bot.guilds.size} serveur(s) Discord\n`);

  bot.user.setActivity(`faire des stats (v${VERSION})`);
}

bot.on('message', msg => {

});

start().catch(err => {
  logger.error('Erreur lors du chargement du bot !');
  logger.error(err.toString());

  console.error(err);

  process.exit(1);
});

function awaitReady (entity) {
  return new Promise(resolve => {
    entity.on('ready', resolve)
  });
}
