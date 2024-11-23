import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../modelos/usuario';  // Importe a interface User

dotenv.config();

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido.' });

    // Adicionando os dados do usuário ao req.user
    req.user = user as User;  // O 'user' retornado do JWT será do tipo User
    next();
  });
};

export default authenticateToken;
