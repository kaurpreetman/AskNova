import express from 'express';
import { ensureAuth } from '../middlewares/auth.js';
import { extractKeywordsAndKaggleApiHit, genResponse, getHistory } from '../controllers/geminiController.js';

const router = express.Router();

router.get("/getRecommendation", extractKeywordsAndKaggleApiHit)


router.post('/prompt', ensureAuth, genResponse)
router.get("/history/:userId", ensureAuth, getHistory)
export default router;