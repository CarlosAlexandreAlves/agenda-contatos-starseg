import { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';

const router = Router();

interface ViaCepResponse {
  erro?: boolean;
  [key: string]: any;
}

router.get('/:cep', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cep = req.params.cep.replace(/\D/g, '');

    if (cep.length !== 8) {
      return res.status(400).json({ erro: 'CEP inválido. Deve conter 8 dígitos numéricos.' });
    }

    const response = await axios.get<ViaCepResponse>(`https://viacep.com.br/ws/${cep}/json/`);

    if (response.data.erro) {
      return res.status(404).json({ erro: 'CEP não encontrado.' });
    }

    return res.json(response.data);
  } catch (error) {
    next(error);
  }
});

export default router;