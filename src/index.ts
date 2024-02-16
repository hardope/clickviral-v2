import express from 'express';
import router from './routes/index';
import connectDB from './database/connect';
import bodyParser from 'body-parser';

const app = express();
connectDB();

app.use(bodyParser.json());

app.get('/', (_req, res) => {
    res.send('<h1>ClickViral API</h1>');
});

app.use('/api', router);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});