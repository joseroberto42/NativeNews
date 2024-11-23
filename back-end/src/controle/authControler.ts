import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../database';
import { User } from '../modelos/usuario';
export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    // Verificar se o usuário já existe
    const [existingUser] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]) as [any[], any];
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'O email já está em uso.' });
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserir o usuário
    await pool.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);

    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    // Verificar se o usuário existe
    const [user] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]) as [any[], any];

    if (user.length === 0) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    // Comparar a senha fornecida com a senha criptografada no banco de dados
    const isMatch = await bcrypt.compare(password, user[0].password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Senha incorreta' });
    }

    // Criar o token de autenticação
    const token = jwt.sign({ id: user[0].id, email: user[0].email }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login realizado com sucesso',
      token: token,
    });
  } catch (error: unknown) {
    // Verificar se o erro é uma instância de Error
    if (error instanceof Error) {
      console.error('Erro ao realizar login:', error.message);
      return res.status(500).json({ error: 'Erro ao realizar login', details: error.message });
    } else {
      console.error('Erro desconhecido:', error);
      return res.status(500).json({ error: 'Erro desconhecido ao realizar login' });
    }
  }
};