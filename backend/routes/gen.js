import express from 'express';

const router = express.Router();

router.post('/response', (req, res) => {
  res.json({ message: 'Gen route stub' });
});

export default router;
