import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { contatoSchema } from './schemas/contatoSchema';
import { z } from 'zod';

const router = express.Router();  // IMPORTANTE: usar express.Router()
const prisma = new PrismaClient();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dadosValidados = contatoSchema.parse(req.body);

    const dataParaCriar = {
      ...dadosValidados,
      complemento: dadosValidados.complemento ?? '',
    };

    const novoContato = await prisma.contato.create({ data: dataParaCriar });
    res.status(201).json(novoContato);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ erros: error.errors.map(e => e.message) });
    }
    next(error);
  }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contatos = await prisma.contato.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(contatos);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contatoId = Number(req.params.id);
    if (isNaN(contatoId)) {
      return res.status(400).json({ erro: 'ID inválido' });
    }

    // Verifica se contato existe
    const contatoExistente = await prisma.contato.findUnique({ where: { id: contatoId } });
    if (!contatoExistente) {
      return res.status(404).json({ erro: 'Contato não encontrado' });
    }

    const dadosValidados = contatoSchema.parse(req.body);
    const dataParaAtualizar = {
      ...dadosValidados,
      complemento: dadosValidados.complemento ?? '',
    };

    const contatoAtualizado = await prisma.contato.update({
      where: { id: contatoId },
      data: dataParaAtualizar,
    });

    res.json(contatoAtualizado);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ erros: error.errors.map(e => e.message) });
    }
    next(error);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contatoId = Number(req.params.id);
    if (isNaN(contatoId)) {
      return res.status(400).json({ erro: 'ID inválido' });
    }

    const contatoExistente = await prisma.contato.findUnique({ where: { id: contatoId } });
    if (!contatoExistente) {
      return res.status(404).json({ erro: 'Contato não encontrado' });
    }

    await prisma.contato.delete({ where: { id: contatoId } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;