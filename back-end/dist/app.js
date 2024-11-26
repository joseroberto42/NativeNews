"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const authRotas_1 = __importDefault(require("./rotas/authRotas")); // Suas rotas de autenticação
const rotasFavoritos_1 = __importDefault(require("./rotas/rotasFavoritos")); // Suas rotas de favoritos
const authMiddleware_1 = __importDefault(require("./middleware/authMiddleware")); // Middleware de autenticação
const erroHandle_1 = require("./middleware/erroHandle"); // Middleware de erro
require("./types/express");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// Permitir requisições de qualquer origem
app.use((0, cors_1.default)({
    origin: 'http://localhost:8081', // URL do seu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Configuração de middlewares
app.use(body_parser_1.default.json()); // Middleware de análise do corpo da requisição (body-parser)
// Rotas de autenticação e favoritos com autenticação
app.use('/api/auth', authRotas_1.default); // Rota de autenticação
app.use('/api/favorites', authMiddleware_1.default, rotasFavoritos_1.default); // Rota de favoritos com autenticação
app.use(erroHandle_1.errorHandler); // Middleware que trata os erros
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
// Exporta o app
exports.default = app;
