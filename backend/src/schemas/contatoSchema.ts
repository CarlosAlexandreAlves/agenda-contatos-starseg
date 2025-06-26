import { z } from 'zod';

export const contatoSchema = z.object({
  nome: z.string().min(1),
  telefone: z.string().min(1),
  email: z.string().email(),
  cep: z.string().optional(),
  estado: z.string().optional(),
  cidade: z.string().optional(),
  bairro: z.string().optional(),
  rua: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  foto: z.string().url().nullable().optional()
});
