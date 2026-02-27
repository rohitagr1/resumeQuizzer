import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import generateQuestionsRouter from './routes/generateQuestionsRouter.ts';
import errorHandleMiddleware from './middleware/errorHandleMiddleware.ts';
import responseHandleMiddleware from './middleware/responseHandleMiddleware.ts';


const app = express();

app.use(cors());
app.use(express.json());

//Response Middleware
app.use( responseHandleMiddleware.responseHandler)

//Routes
app.use('/', generateQuestionsRouter);

//Error Middleware
app.use( errorHandleMiddleware.errorHandler );


const PORT = Number(process.env.PORT) || 4000;

app.listen( PORT, () => {
    console.log(`server running on ${PORT}`);
});







