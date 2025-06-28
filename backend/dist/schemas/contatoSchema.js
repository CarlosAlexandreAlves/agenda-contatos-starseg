"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contatoSchema = void 0;
const zod_1 = require("zod");
exports.contatoSchema = zod_1.z.object({
    nome: zod_1.z.string().min(1),
    telefone: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    cep: zod_1.z.string().optional(),
    estado: zod_1.z.string().optional(),
    cidade: zod_1.z.string().optional(),
    bairro: zod_1.z.string().optional(),
    rua: zod_1.z.string().optional(),
    numero: zod_1.z.string().optional(),
    complemento: zod_1.z.string().optional(),
    foto: zod_1.z.string().optional().nullable(),
});
//# sourceMappingURL=contatoSchema.js.map