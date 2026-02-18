import express from 'express';
import { generateQuestionsController } from '../controllers/generateQuestionsController.ts';

const router = express.Router();

router.post('/generate-questions', generateQuestionsController );

export default router;














