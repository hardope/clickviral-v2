import express from 'express';
import router from './routes/index';
import connectDB from './database/connect';
import bodyParser from 'body-parser';
import logger from './middleware/logger';
import { PORT, ALLOWED_HOSTS, DEV } from './utils/environment';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import passport from 'passport';
import { passportConfig } from './middleware/passport';

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

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(logger());
app.use(fileUpload());
app.use(passport.initialize());

app.get('/', (_req, res) => {
    res.send('<h1>ClickViral Backend API V2</h1>');
});

app.get('/docs', (_req, res) => {
    res.send('<h1>ClickViral API V2 - Documentation</h1>');
});

app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { app }
