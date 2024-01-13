import express from 'express';
import { articlesRouter } from './routes/articles.js';
import 'dotenv/config.js';
import resError from './utils/resError.js';
import cors from 'cors';
import { authRouter } from './routes/auth.js';

const app = express();

app.use(express.json());

//Por defecto da acceso a todos lo origines "*", por lo que luego se debe de configurar. Luego lo configuraré para hacerlo correctamente.
app.use(cors());
app.disable('x-powered-by');

app.use('/api/articles', articlesRouter);
app.use('/api/auth', authRouter);

app.use((err, req, res, next) => {
	const { statusCode, message } = err;
	resError(res, statusCode, message);
});

const PORT = process.env.PORT || 1234;

app.listen(PORT);

console.log(`server active in port: http://localhost:${PORT}`);
