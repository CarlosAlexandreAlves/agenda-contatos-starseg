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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const userSchema_1 = require("./schemas/userSchema");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.post('/users', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dadosValidados = userSchema_1.userSchema.parse(req.body);
        const novoUser = yield prisma.user.create({
            data: {
                nome: dadosValidados.nome,
                email: dadosValidados.email,
                senha: dadosValidados.senha,
            }
        });
        res.status(201).json({ id: novoUser.id, nome: novoUser.nome, email: novoUser.email });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ erros: error.errors.map(e => e.message) });
        }
        next(error);
    }
}));
exports.default = router;
//# sourceMappingURL=userRoutes.js.map