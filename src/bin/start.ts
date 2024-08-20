#!/usr/bin/env node
'use strict';

import express, {type Express} from 'express';
import {Server} from 'http';


class AppServer {
    static run() {
        new AppServer();
    }

    private app: Express;
    private server: Server;

    constructor() {
        this.app = express();

        this.setupRoutes();
        this.server = this.app.listen(process.env.PORT || 8080);

        process.on('SIGINT', () => this.stop());
        process.on('SIGTERM', () => this.stop());
    }

    setupRoutes() {
        this.app.get('/ping', (req, res) => {
            res.send('pong');
        });

        // add additional routes
    }

    async stop() {
        await new Promise(cb => this.server.close(cb));

        // await db.close() if we have a db connection in this app
        // await other things we should cleanup nicely

        process.exit();
    }
}

AppServer.run();
