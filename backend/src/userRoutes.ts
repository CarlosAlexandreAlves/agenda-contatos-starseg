import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { userSchema } from './schemas/userSchema';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

router.post('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dadosValidados = userSchema.parse(req.body);

    const novoUser = await prisma.user.create({
      data: {
        nome: dadosValidados.nome,
        email: dadosValidados.email,
        senha: dadosValidados.senha,
      }
    });

    res.status(201).json({ id: novoUser.id, nome: novoUser.nome, email: novoUser.email });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ erros: error.errors.map(e => e.message) });
    }
    next(error);
  }
});

export default router;