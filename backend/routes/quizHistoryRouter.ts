import express  from "express";
import authMiddleware from "../middleware/authMiddleware.ts";
import quizHistoryControllers from "../controllers/quizHistoryControllers.ts";

const router = express.Router();

router.post("/", authMiddleware.firebaseAuthenticater, quizHistoryControllers.createQuizHistoryController);

router.get("/", authMiddleware.firebaseAuthenticater, quizHistoryControllers.showQuizHistoryController);

router.get("/:id", authMiddleware.firebaseAuthenticater, quizHistoryControllers.selectQuizHistoryController);

export default router;
