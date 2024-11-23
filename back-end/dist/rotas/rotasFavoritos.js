"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const favoritosControler_1 = require("../controle/favoritosControler");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
// Rota para adicionar um favorito
router.post('/favorites', authMiddleware_1.default, favoritosControler_1.addFavorite);
// Rota para listar os favoritos do usuário
router.get('/favorites', authMiddleware_1.default, favoritosControler_1.getFavorites);
// Rota para remover um favorito
router.delete('/favorites', authMiddleware_1.default, favoritosControler_1.removeFavorite);
exports.default = router;
