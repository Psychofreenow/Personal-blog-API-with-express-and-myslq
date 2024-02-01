import express from 'express';
import { articlesRouter } from './routes/articles.js';
import 'dotenv/config.js';
import cors from 'cors';
import { authRouter } from './routes/auth.js';
import errorsHandle from './middleware/errorsHandle.js';

const app = express();

app.use(express.json());

//Por defecto da acceso a todos lo origines "*", por lo que luego se debe de configurar. Luego lo configuraré para hacerlo correctamente.
app.use(cors());
app.disable('x-powered-by');

app.use('/api/article', articlesRouter);

app.use('/api/auth', authRouter);

app.use(errorsHandle);

const PORT = process.env.PORT || 1234;

app.listen(PORT);

console.log(`server active in port: http://localhost:${PORT}`);
