import fs from 'fs';
import logger from './logger';

const defaultConfig = {
  prefix: '!',
  token: '',

  arangodb: {
    host: '127.0.0.1',
    port: 8529,

    user: '',
    password: '',

    database: 'stats'
  },

  api: {
    port: 5565,
    jwtSecret: 'PLEASE_CHANGE_THIS',
    jwtExpiresIn: '7d'
  }
};

const configFile = 'bot.json';
export let config = defaultConfig;

export function load() {
  if (!fs.existsSync(configFile)) {
    save();

    logger.warn('La configuration par défaut a été écrite dans bot.json');
    logger.warn('Veuillez remplir le fichier, puis relancer le bot');

    process.exit(0);
  }

  config = JSON.parse(fs.readFileSync(configFile));
}

export function save() {
  fs.writeFileSync(configFile, JSON.stringify(config, null, 4));
}
