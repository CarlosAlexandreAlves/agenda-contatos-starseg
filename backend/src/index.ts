import express, { Request, Response, NextFunction } from 'express';
import contatoRoutes from './contatoRoutes';
import userRoutes from './userRoutes';  
import viacepRoutes from './viacepRoutes';
import cors from 'cors';

const app = express();
const PORT = 4000;

app.use(cors()); // CORS deve vir primeiro
app.use(express.json()); // parser JSON

// Prefixos para organizar rotas e evitar conflito
app.use('/contatos', contatoRoutes);
app.use('/users', userRoutes);
app.use('/cep', viacepRoutes);

// Middleware global para tratamento de erros
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Erro no servidor:', err);
  res.status(500).json({ erro: 'Erro interno no servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});