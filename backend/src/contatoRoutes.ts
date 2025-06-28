import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import { contatoSchema } from './schemas/contatoSchema';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import express from 'express';

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({ dest: 'uploads/' });

function deletarImagem(nomeArquivo: string) {
  const caminho = path.join(__dirname, '..', '..', 'uploads', nomeArquivo);
  if (fs.existsSync(caminho)) {
    fs.unlinkSync(caminho);
  }
}

router.delete('/uploads/:nomeArquivo', async (req, res) => {
  const nomeArquivo = req.params.nomeArquivo;
  const caminho = path.join(__dirname, '..', '..', 'uploads', nomeArquivo);

  try {
    if (fs.existsSync(caminho)) {
      fs.unlinkSync(caminho);
      return res.status(200).json({ mensagem: 'Imagem removida com sucesso.' });
    } else {
      return res.status(404).json({ erro: 'Arquivo não encontrado.' });
    }
  } catch (erro) {
    console.error('Erro ao remover imagem:', erro);
    return res.status(500).json({ erro: 'Erro interno ao excluir a imagem.' });
  }
});


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


router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const dadosValidados = contatoSchema.parse(req.body);

    const contatoExistente = await prisma.contato.findUnique({
      where: { id: Number(id) },
    });

    if (!contatoExistente) {
      return res.status(404).json({ erro: 'Contato não encontrado' });
    }


    if (
      contatoExistente.foto &&
      contatoExistente.foto !== dadosValidados.foto
    ) {
      deletarImagem(contatoExistente.foto);
    }

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


router.get('/', async (req: Request, res: Response) => {
  const contatos = await prisma.contato.findMany();
  res.json(contatos);
});


router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contato = await prisma.contato.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!contato) {
      return res.status(404).json({ erro: 'Contato não encontrado' });
    }


    if (contato.foto) {
      deletarImagem(contato.foto);
    }

    await prisma.contato.delete({
      where: { id: Number(req.params.id) },
    });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});


router.post('/upload', upload.single('foto'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ erro: 'Nenhuma imagem enviada' });
  }

  const url = `http://localhost:4000/uploads/${req.file.filename}`;
  res.status(201).json({ url });
});

export default router;