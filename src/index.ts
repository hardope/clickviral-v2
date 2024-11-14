import express from 'express';
import userRouter from './apps/user/route';
import connectDB from './database/connect';
import bodyParser from 'body-parser';
import logger from './middleware/logger';
import { PORT, ALLOWED_HOSTS, DEV } from './utils/environment';
import cors from 'cors';
import passport from 'passport';
import { passportConfig } from './middleware/passport';
import { WebSocketServer } from 'ws';
import http from 'http';
import { wssMessenger } from './apps/messenger/controller';

const corsOptions = {
    origin: (origin: any, callback: any) => {
        if (DEV) {
            if (!origin) {
                return callback(null, true);
            }
        }
        if (ALLOWED_HOSTS.includes(origin) || ALLOWED_HOSTS.includes('*') || origin.startsWith('http://localhost')) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    }
};

const app = express();
connectDB();
passportConfig();

const server = http.createServer(app);

const wssNotification = new WebSocketServer({ noServer: true });

wssNotification.on('connection', (ws) => {
    ws.send(JSON.stringify({'message':'Connection successful - notification'}));
    ws.on('message', (message) => {
        console.log(`Received message => ${message}`);
        ws.send(JSON.stringify({'message':'Message received - notification'}));
    });
});

server.on('upgrade', (request, socket, head) => {

    const pathname = request.url;

    console.log(`[${new Date().toISOString()} -- [WS] -- ${pathname}`);

    if (pathname?.startsWith('/messenger')) {
        wssMessenger.handleUpgrade(request, socket, head, (ws) => {
            wssMessenger.emit('connection', ws, request);
        });
    } else if (pathname == '/notification') {
        wssNotification.handleUpgrade(request, socket, head, (ws) => {
            wssNotification.emit('connection', ws, request);
        });
    } else {
        socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
        socket.destroy();
    }
});

// Middleware setup
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(logger());
app.use(passport.initialize());

app.get('/', (_req, res) => {
    res.send('<h1>ClickViral Backend API V2</h1>');
});

app.use('/user', userRouter);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { app };
