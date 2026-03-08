import express from 'express';
import { generateQuestionsController } from '../controllers/generateQuestionsController.ts';
import uploadPDFMiddleware from '../middleware/uploadPDFMiddleware.ts';
import authMiddleware from '../middleware/authMiddleware.ts';

const router = express.Router();

router.post('/generate-questions', authMiddleware.firebaseAuthenticater, uploadPDFMiddleware.uploadPDF('resume'), generateQuestionsController );

export default router;














