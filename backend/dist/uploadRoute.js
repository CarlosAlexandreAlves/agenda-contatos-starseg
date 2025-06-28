"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: 'uploads/',
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({ storage });
router.post('/', upload.single('foto'), (req, res) => {
    if (!req.file)
        return res.status(400).json({ erro: 'Nenhuma imagem enviada' });
    const url = `http://localhost:4000/uploads/${req.file.filename}`;
    res.status(201).json({ url });
});
exports.default = router;
//# sourceMappingURL=uploadRoute.js.map