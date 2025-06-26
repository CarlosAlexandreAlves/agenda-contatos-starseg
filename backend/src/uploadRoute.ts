import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/', upload.single('foto'), (req, res) => {
  if (!req.file) return res.status(400).json({ erro: 'Nenhuma imagem enviada' });

  const url = `http://localhost:4000/uploads/${req.file.filename}`;
  res.status(201).json({ url });
});

export default router;