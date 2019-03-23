import express from 'express';

import logger from './logger';
import { config } from './config';
import { guilds, ranking } from './controller';

import corsMiddleware from './cors';

const app = express();

app.use(corsMiddleware);
app.use(express.json());

app.get('/guilds', e(guilds));
app.post('/ranking', e(ranking));

export async function start () {
    const { port } = config.api;
    await awaitReady(port);

    return port;
}

function awaitReady (port) {
    return new Promise(resolve => {
        app.listen(port, resolve)
    });
}

// Error handler
function e(route) {
    return (req, res) => {
        route(req, res).catch(err => {
            logger.error("Error during HTTP request !");
            logger.error(err);

            // eslint-disable-next-line no-console
            console.error(err);

            res.status(500).json({
                message: 'Internal error'
            });
        })
    }
}
