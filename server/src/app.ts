import 'dotenv/config';
import express from 'express';
import router from './routes/router.js';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', router);
