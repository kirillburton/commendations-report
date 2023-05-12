import 'dotenv/config';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import http from 'http';
import https from 'https';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import { router } from './routes.js';

const app = new Koa();
const isDevMode = process.env.NODE_ENV === 'development';

// Error handling
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err: any) {
        ctx.status = err.status || 500;
        ctx.body = {
            error: {
                code: ctx.status,
                message: err.message
            }
        };
        ctx.app.emit('error', err, ctx);
    }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fullpath = join(__dirname, '../client');

app.use(serve(fullpath));
app.use(bodyParser());

app.use(router.routes()).use(router.allowedMethods());

const config = {
    domain: isDevMode ? 'localhost' : 'allies.report',
    https: {
        port: 443,
        options: isDevMode
            ? {}
            : {
                  key: fs
                      .readFileSync(
                          join(__dirname, '../../certs/privkey.pem'),
                          'utf8'
                      )
                      .toString(),
                  cert: fs
                      .readFileSync(
                          join(__dirname, '../../certs/fullchain.pem'),
                          'utf8'
                      )
                      .toString()
              }
    },
    http: {
        port: 80
    }
};

const serverCallback = app.callback();

try {
    const httpsServer = https.createServer(
        config.https.options,
        serverCallback
    );
    const httpServer = http.createServer(serverCallback);
    httpServer.listen(config.http.port, () => {
        console.log(
            `HTTP server OK, listening on: http://${config.domain}:${config.http.port}`
        );
    });
    httpsServer.listen(config.https.port, () => {
        console.log(
            `HTTPS server OK, listening on: https://${config.domain}:${config.https.port}`
        );
    });
} catch (ex: any) {
    console.error('Failed to start server\n', ex, ex && ex.stack);
}
