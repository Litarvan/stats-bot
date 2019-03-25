import fs from 'fs';
import logger from './logger';

const defaultConfig = {
  trigger: 'stats link',
  token: '',
  url: "http://127.0.0.1:8080/",

  arangodb: {
    host: '127.0.0.1',
    port: 8529,

    user: '',
    password: '',

    database: 'stats'
  },

  api: {
    host: '127.0.0.1',
    port: 5565,
    jwtSecret: 'PLEASE_CHANGE_THIS',
    jwtExpiresIn: '7d'
  },

  discord: {
    client: '',
    secret: ''
  }
};

const configFile = 'bot.json';
export let config = defaultConfig;

export function load() {
  if (!fs.existsSync(configFile)) {
    save();

    logger.warn('Default configuration was written in bot.json');
    logger.warn('Please fill it before starting the bot again');

    process.exit(0);
  }

  config = JSON.parse(fs.readFileSync(configFile));
}

export function save() {
  fs.writeFileSync(configFile, JSON.stringify(config, null, 4));
}
