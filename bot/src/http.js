import express from 'express';

import logger from './logger';
import { config } from './config';
import { guilds, stats } from './controller';
import corsMiddleware from './cors';
import { login, callback, validate as authMiddleware, logout } from './auth';

const app = express();

app.use(corsMiddleware);
app.use(authMiddleware);
app.use(express.json());

app.get('/guilds', e(guilds));
app.post('/stats', e(stats));
app.get('/auth/login', e(login))
app.get('/auth/callback', e(callback));
app.post('/auth/logout', e(logout));

export async function start () {
    const { host, port } = config.api;
    await awaitReady(host, port);

    return port;
}

function awaitReady (host, port) {
    return new Promise(resolve => {
        app.listen(port, host, resolve)
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
