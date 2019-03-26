import fetch from 'node-fetch';
import btoa from 'btoa';
import jwt from 'jsonwebtoken';

import { config } from './config';

function redirectURL(red) {
    const { host, port } = config.api;
    return encodeURIComponent(`http://${host}` + (host === '127.0.0.1' ? `:${port}` : '') + '/auth/callback?r=' + red);
}

export async function login(req, res) {
    res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${config.discord.client}&scope=guilds%20identify&response_type=code&redirect_uri=${redirectURL(req.query.r)}`);
}

export async function callback(req, res) {
    if (!req.query.code) throw new Error('No code provided');

    const code = req.query.code;
    const creds = btoa(`${config.discord.client}:${config.discord.secret}`);
    let response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirectURL(req.query.r)}`,
        {
            method: 'POST',
            headers: {
                Authorization: `Basic ${creds}`,
            },
        });

    let json = await response.json();

    if (!json.access_token) {
        res.status(403).send('Failed auth');
        return;
    }

    const accessToken = json.access_token;

    response = await fetch('http://discordapp.com/api/users/@me', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    json = await response.json();
    const token = jwt.sign({
        data: {
            id: json.id,
            name: json.username,
            fullName: json.username + '#' + json.discriminator,
            avatar: `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}.png?size=128`,
            token: accessToken
        }
    }, config.api.jwtSecret, {
        expiresIn: config.api.jwtExpiresIn
    });

    res.redirect(req.query.r + '?token=' + token);
}

export async function logout(req, res) {
    const response = await fetch(`https://discordapp.com/api/oauth2/revoke?token=${req.token.data.token}`, {
        method: 'POST'
    });

    res.send(await response.json());
}

export async function validate(req, res, next) {
    if (req.method.toLowerCase() === 'options' || req.path === '/' || req.path === '/auth/login' || req.path === '/auth/callback') {
        return next();
    }

    const auth = req.headers.authorization;

    if (!auth || auth.length < 8) {
        return res.status(401).send({
            error: 'Unauthorized'
        });
    }

    try {
        req.token = jwt.verify(auth.substring(7), config.api.jwtSecret);
    } catch (err) {
        return res.status(401).send({
            error: 'Unauthorized'
        });
    }

    next();
}
