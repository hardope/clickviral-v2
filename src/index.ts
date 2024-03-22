import express from 'express';
import router from './routes/index';
import connectDB from './database/connect';
import bodyParser from 'body-parser';
import logger from './middleware/logger';
import { PORT } from './utils/environment';
import fileUpload from 'express-fileupload';

const app = express();
connectDB();

app.use(bodyParser.json());
app.use(logger());
app.use(fileUpload());

app.get('/', (_req, res) => {
    res.send('<h1>ClickViral API</h1>');
});

app.post('/upload', (req, res) => {
    console.log(req.files)
    if (req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }
    return res.status(200).json({ msg: 'File uploaded successfully' });
});

app.use('/api', router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});