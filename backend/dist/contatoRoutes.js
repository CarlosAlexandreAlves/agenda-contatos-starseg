"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const client_1 = require("@prisma/client");
const contatoSchema_1 = require("./schemas/contatoSchema");
const zod_1 = require("zod");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const upload = (0, multer_1.default)({ dest: 'uploads/' });


function deletarImagem(nomeArquivo) {
    const caminho = path_1.default.join(__dirname, '..', '..', 'uploads', nomeArquivo);
    if (fs_1.default.existsSync(caminho)) {
        fs_1.default.unlinkSync(caminho);
    }
}

router.delete('/uploads/:nomeArquivo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const nomeArquivo = req.params.nomeArquivo;
    const caminho = path_1.default.join(__dirname, '..', '..', 'uploads', nomeArquivo);
    try {
        if (fs_1.default.existsSync(caminho)) {
            fs_1.default.unlinkSync(caminho);
            return res.status(200).json({ mensagem: 'Imagem removida com sucesso.' });
        }
        else {
            return res.status(404).json({ erro: 'Arquivo não encontrado.' });
        }
    }
    catch (erro) {
        console.error('Erro ao remover imagem:', erro);
        return res.status(500).json({ erro: 'Erro interno ao excluir a imagem.' });
    }
}));

function prepararContato(dados) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return Object.assign(Object.assign({}, dados), { complemento: (_a = dados.complemento) !== null && _a !== void 0 ? _a : '', cep: (_b = dados.cep) !== null && _b !== void 0 ? _b : null, estado: (_c = dados.estado) !== null && _c !== void 0 ? _c : null, cidade: (_d = dados.cidade) !== null && _d !== void 0 ? _d : null, bairro: (_e = dados.bairro) !== null && _e !== void 0 ? _e : null, rua: (_f = dados.rua) !== null && _f !== void 0 ? _f : null, numero: (_g = dados.numero) !== null && _g !== void 0 ? _g : null, foto: (_h = dados.foto) !== null && _h !== void 0 ? _h : null });
}

router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dadosValidados = contatoSchema_1.contatoSchema.parse(req.body);
        const novoContato = yield prisma.contato.create({
            data: prepararContato(dadosValidados),
        });
        res.status(201).json(novoContato);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ erros: error.errors.map(e => e.message) });
        }
        next(error);
    }
}));

router.put('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const dadosValidados = contatoSchema_1.contatoSchema.parse(req.body);
        const contatoExistente = yield prisma.contato.findUnique({
            where: { id: Number(id) },
        });
        if (!contatoExistente) {
            return res.status(404).json({ erro: 'Contato não encontrado' });
        }

        if (contatoExistente.foto &&
            contatoExistente.foto !== dadosValidados.foto) {
            deletarImagem(contatoExistente.foto);
        }
        const contatoAtualizado = yield prisma.contato.update({
            where: { id: Number(id) },
            data: prepararContato(dadosValidados),
        });
        res.json(contatoAtualizado);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ erros: error.errors.map(e => e.message) });
        }
        next(error);
    }
}));

router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contatos = yield prisma.contato.findMany();
    res.json(contatos);
}));

router.delete('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contato = yield prisma.contato.findUnique({
            where: { id: Number(req.params.id) },
        });
        if (!contato) {
            return res.status(404).json({ erro: 'Contato não encontrado' });
        }

        if (contato.foto) {
            deletarImagem(contato.foto);
        }
        yield prisma.contato.delete({
            where: { id: Number(req.params.id) },
        });
        res.status(204).end();
    }
    catch (error) {
        next(error);
    }
}));

router.post('/upload', upload.single('foto'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ erro: 'Nenhuma imagem enviada' });
    }
    const url = `http://localhost:4000/uploads/${req.file.filename}`;
    res.status(201).json({ url });
});
exports.default = router;
//# sourceMappingURL=contatoRoutes.js.map