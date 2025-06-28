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
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const router = (0, express_1.Router)();
router.get('/:cep', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cep = req.params.cep.replace(/\D/g, '');
        if (cep.length !== 8) {
            return res.status(400).json({ erro: 'CEP inválido. Deve conter 8 dígitos numéricos.' });
        }
        const response = yield axios_1.default.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (response.data.erro) {
            return res.status(404).json({ erro: 'CEP não encontrado.' });
        }
        return res.json(response.data);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
//# sourceMappingURL=viacepRoutes.js.map