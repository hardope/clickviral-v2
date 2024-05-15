import express from 'express';
import router from './routes/index';
import connectDB from './database/connect';
import bodyParser from 'body-parser';
import logger from './middleware/logger';
import { PORT } from './utils/environment';
import fileUpload from 'express-fileupload';
import cors from 'cors';

const allowedHosts = [
    'http://localhost:8000',
    // Add more as needed
];

const corsOptions = {
    origin: (origin: any, callback: any) => {
        if (allowedHosts.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    }
};

const app = express();
connectDB();

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(logger());
app.use(fileUpload());

app.get('/', (_req, res) => {
    res.send('<h1>ClickViral API</h1>');
});

app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { app }