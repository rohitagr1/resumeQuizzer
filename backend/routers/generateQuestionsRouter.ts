import express from 'express';
import multer from 'multer';
import { generateQuestions } from '../controllers/generateQuestionsController.ts';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/generate-questions', upload.single('resume'), generateQuestions);

export default router;














