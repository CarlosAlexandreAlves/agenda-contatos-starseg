import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import { contatoSchema } from './schemas/contatoSchema';
import { z } from 'zod';
import path from 'path';

const router = Router();
const prisma = new PrismaClient();
const upload = multer({ dest: 'uploads/' });

// ✅ AJUSTE 1: Converter campos opcionais undefined → null para evitar erro de tipagem do Prisma
function prepararContato(dados: any) {
  return {
    ...dados,
    complemento: dados.complemento ?? '',
    cep: dados.cep ?? null,
    estado: dados.estado ?? null,
    cidade: dados.cidade ?? null,
    bairro: dados.bairro ?? null,
    rua: dados.rua ?? null,
    numero: dados.numero ?? null,
    foto: dados.foto ?? null,
  };
}

// ✅ ROTA PARA CRIAR CONTATO
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dadosValidados = contatoSchema.parse(req.body);

    const novoContato = await prisma.contato.create({
      data: prepararContato(dadosValidados),
    });

    res.status(201).json(novoContato);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ erros: error.errors.map(e => e.message) });
    }
    next(error);
  }
});

// ✅ ROTA PARA EDITAR CONTATO
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const dadosValidados = contatoSchema.parse(req.body);

    const contatoAtualizado = await prisma.contato.update({
      where: { id: Number(id) },
      data: prepararContato(dadosValidados),
    });

    res.json(contatoAtualizado);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ erros: error.errors.map(e => e.message) });
    }
    next(error);
  }
});

// ✅ ROTA PARA LISTAR CONTATOS
router.get('/', async (req: Request, res: Response) => {
  const contatos = await prisma.contato.findMany();
  res.json(contatos);
});

// ✅ ROTA PARA DELETAR CONTATO
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.contato.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// ✅ ROTA SEPARADA PARA UPLOAD DE IMAGEM
router.post('/upload', upload.single('foto'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ erro: 'Nenhuma imagem enviada' });
  }

  const url = `http://localhost:4000/uploads/${req.file.filename}`;
  res.status(201).json({ url });
});

export default router;
