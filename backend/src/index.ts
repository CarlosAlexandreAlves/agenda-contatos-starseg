import express, { Request, Response, NextFunction } from 'express';
import contatoRoutes from './contatoRoutes';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/contatos', contatoRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Erro no servidor:', err);
  res.status(500).json({ erro: 'Erro interno no servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
