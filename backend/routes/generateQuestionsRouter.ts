import express from 'express';
import { generateQuestionsController } from '../controllers/generateQuestionsController.ts';
import uploadPDFMiddleware from '../middleware/uploadPDFMiddleware.ts';

const router = express.Router();

router.post('/generate-questions', uploadPDFMiddleware.uploadPDF, generateQuestionsController );

export default router;














