"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFavorite = exports.getFavorites = exports.addFavorite = void 0;
const database_1 = __importDefault(require("../database"));
// Adicionar favorito
const addFavorite = async (req, res) => {
    const { id: userId } = req.user; // Desestruturando userId de req.user
    const { title, description, imageUrl, newsUrl } = req.body;
    // Verificar se todos os campos necessários estão presentes
    if (!title || !description || !imageUrl || !newsUrl) {
        return res.status(400).json({ error: 'Os campos "title", "description", "imageUrl" e "newsUrl" são obrigatórios.' });
    }
    try {
        // Verificar se o item já foi adicionado aos favoritos
        const [existingFavorite] = await database_1.default.execute('SELECT * FROM favorites WHERE user_id = ? AND newsUrl = ?', [userId, newsUrl]);
        if (existingFavorite.length > 0) {
            return res.status(400).json({ error: 'Esse item já está nos seus favoritos.' });
        }
        // Inserir favorito com as informações detalhadas da notícia
        const result = await database_1.default.execute('INSERT INTO favorites (user_id, title, description, imageUrl, newsUrl) VALUES (?, ?, ?, ?, ?)', [userId, title, description, imageUrl, newsUrl]);
        console.log('Resultado da inserção:', result);
        res.status(201).json({ message: 'Favorito adicionado com sucesso' });
    }
    catch (error) {
        console.error('Erro ao adicionar favorito:', error);
        res.status(500).json({
            error: 'Erro ao adicionar favorito',
            details: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};
exports.addFavorite = addFavorite;
// Listar favoritos do usuário
const getFavorites = async (req, res) => {
    const { id: userId } = req.user; // Desestruturando userId de req.user
    try {
        const [favorites] = await database_1.default.execute('SELECT * FROM favorites WHERE user_id = ?', [userId]);
        if (favorites.length === 0) {
            return res.status(404).json({ message: 'Nenhum favorito encontrado.' });
        }
        res.status(200).json(favorites);
    }
    catch (error) {
        console.error('Erro ao buscar favoritos:', error);
        res.status(500).json({ error: 'Erro ao buscar favoritos' });
    }
};
exports.getFavorites = getFavorites;
// Remover favorito
const removeFavorite = async (req, res) => {
    const { id: userId } = req.user; // Desestruturando userId de req.user
    const { item_id } = req.body;
    if (!item_id) {
        return res.status(400).json({ error: 'O campo "item_id" é obrigatório.' });
    }
    try {
        // Verificar se o favorito existe
        const [favorite] = await database_1.default.execute('SELECT * FROM favorites WHERE user_id = ? AND item_id = ?', [userId, item_id]);
        if (favorite.length === 0) {
            return res.status(404).json({ error: 'Esse item não está nos seus favoritos.' });
        }
        // Remover favorito
        await database_1.default.execute('DELETE FROM favorites WHERE user_id = ? AND item_id = ?', [userId, item_id]);
        res.status(200).json({ message: 'Favorito removido com sucesso' });
    }
    catch (error) {
        console.error('Erro ao remover favorito:', error);
        res.status(500).json({ error: 'Erro ao remover favorito' });
    }
};
exports.removeFavorite = removeFavorite;
