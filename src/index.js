import express from 'express';
import { articlesRouter } from './routes/articles.js';
import 'dotenv/config.js';
import resError from './utils/resError.js';

const app = express();

app.use(express.json());

app.disable('x-powered-by');

app.use('/articles', articlesRouter);

app.use((err, req, res, next) => {
	const { statusCode, message } = err;
	resError(res, statusCode, message);
});

const PORT = process.env.PORT || 1234;

app.listen(PORT);

console.log(`server active in port: http://localhost:${PORT}`);
