import { Request, Response } from 'express';
import pool from '../database';


// Adicionar favorito
export const addFavorite = async (req: Request, res: Response) => {
  const { id: userId } = req.user!;  // Desestruturando userId de req.user
  const { title, description, imageUrl, newsUrl, item_id } = req.body;

  // Verificar se todos os campos necessários estão presentes
  if (!title || !description || !newsUrl || !item_id) {
    return res.status(400).json({ error: 'Os campos "title", "description", "newsUrl" e "item_id" são obrigatórios.' });
  }

  try {
    // Verificar se o item já foi adicionado
    const [existingFavorite] = await pool.execute(
      'SELECT * FROM favorites WHERE user_id = ? AND newsUrl = ?', [userId, newsUrl]
    ) as [any[], any];

    if (existingFavorite.length > 0) {
      return res.status(400).json({ error: 'Esse item já está nos seus favoritos.' });
    }

    // Inserir favorito com as informações detalhadas da notícia
    const result = await pool.execute(
      'INSERT INTO favorites (user_id, title, description, imageUrl, newsUrl, item_id) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, title, description, imageUrl, newsUrl, item_id]
    );
    console.log('Resultado da inserção:', result);

    res.status(201).json({ message: 'Favorito adicionado com sucesso' });
  } catch (error) {
    console.error('Erro ao adicionar favorito:', error);
    res.status(500).json({ 
      error: 'Erro ao adicionar favorito',
      details: error instanceof Error ? error.message : 'Erro desconhecido' 
    });
  }
};

// Listar favoritos do usuário
export const getFavorites = async (req: Request, res: Response) => {
  const { id: userId } = req.user!;  // Desestruturando userId de req.user

  try {
    const [favorites] = await pool.execute('SELECT * FROM favorites WHERE user_id = ?', [userId]) as [any[], any];

    if (favorites.length === 0) {
      return res.status(404).json({ message: 'Nenhum favorito encontrado.' });
    }

    res.status(200).json(favorites);
  } catch (error) {
    console.error('Erro ao buscar favoritos:', error);
    res.status(500).json({ error: 'Erro ao buscar favoritos' });
  }
};

// Remover favorito
export const removeFavorite = async (req: Request, res: Response) => {
  const { id: userId } = req.user!;  // Desestruturando userId de req.user
  const { item_id } = req.body;

  if (!item_id) {
    return res.status(400).json({ error: 'O campo "item_id" é obrigatório.' });
  }

  try {
    // Verificar se o favorito existe
    const [favorite] = await pool.execute('SELECT * FROM favorites WHERE user_id = ? AND item_id = ?', [userId, item_id]) as [any[], any];
    if (favorite.length === 0) {
      return res.status(404).json({ error: 'Esse item não está nos seus favoritos.' });
    }

    // Remover favorito
    await pool.execute('DELETE FROM favorites WHERE user_id = ? AND item_id = ?', [userId, item_id]);
    res.status(200).json({ message: 'Favorito removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover favorito:', error);
    res.status(500).json({ error: 'Erro ao remover favorito' });
  }
};
