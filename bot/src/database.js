import { Database } from 'arangojs';

import logger from './logger';
import { config } from './config';

const COLLECTIONS = [
    'users',
    'guilds'
];

export let db;

export function login () {
  db = new Database({
    url: 'http://' + config.arangodb.host + ':' + config.arangodb.port
  });

  return db.login(config.arangodb.user, config.arangodb.password);
}

export async function init () {
  const dbName = config.arangodb.database;

  if (config.arangodb.user === 'root') {
    const databases = await db.listDatabases();

    let found = false;

    for (const database of databases) {
      if (database === dbName) {
        found = true;
        break;
      }
    }

    if (!found) {
      await db.createDatabase(dbName);
    }
  }

  db.useDatabase(dbName);

  for (const name of COLLECTIONS) {
    const c = db.collection(name);

    if (!(await c.exists())) {
      logger.debug(`  - Creating collection '${c.name}'`);
      await c.create();
    }
  }
}

export function query (query, args) {
  for (const key in args) {
    if (args[key] === undefined || args[key] === null) delete args[key];
  }

  return db.query({
    query,
    bindVars: args || {}
  });
}

export async function fullQuery (q, args) {
  return (await query(q, args)).all();
}
