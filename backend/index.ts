import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import generateQuestionsRouter from './routes/generateQuestionsRouter.ts';
import errorHandleMiddleware from './middleware/errorHandleMiddleware.ts'

const app = express();

app.use(cors());
app.use(express.json());

//Routes
app.use('/', generateQuestionsRouter);

//Error Middleware
app.use( errorHandleMiddleware.errorHandle );


const PORT = Number(process.env.PORT) || 4000;

app.listen( PORT, () => {
    console.log(`server running on ${PORT}`);
});







