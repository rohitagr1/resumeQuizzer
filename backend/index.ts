import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import generateQuestionsRouter from './routes/generateQuestionsRouter.ts';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', generateQuestionsRouter);

const PORT = Number(process.env.PORT) || 4000;

app.listen( PORT, () => {
    console.log(`server running on ${PORT}`);
});







