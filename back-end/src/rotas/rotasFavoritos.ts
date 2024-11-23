import express from 'express';
import { addFavorite, getFavorites, removeFavorite } from '../controle/favoritosControler';
import authenticateToken from '../middleware/authMiddleware';

const router = express.Router();

// Rota para adicionar um favorito
router.post('/favorites', authenticateToken, addFavorite);

// Rota para listar os favoritos do usuário
router.get('/favorites', authenticateToken, getFavorites);

// Rota para remover um favorito
router.delete('/favorites', authenticateToken, removeFavorite);

export default router;
