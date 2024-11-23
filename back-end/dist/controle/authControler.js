"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../database"));
const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    try {
        // Verificar se o usuário já existe
        const [existingUser] = await database_1.default.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'O email já está em uso.' });
        }
        // Criptografar a senha
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Inserir o usuário
        await database_1.default.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
        res.status(201).json({ message: 'Usuário registrado com sucesso' });
    }
    catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }
    try {
        // Verificar se o usuário existe
        const [user] = await database_1.default.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(400).json({ error: 'Usuário não encontrado' });
        }
        // Comparar a senha fornecida com a senha criptografada no banco de dados
        const isMatch = await bcryptjs_1.default.compare(password, user[0].password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Senha incorreta' });
        }
        // Criar o token de autenticação
        const token = jsonwebtoken_1.default.sign({ id: user[0].id, email: user[0].email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            message: 'Login realizado com sucesso',
            token: token,
        });
    }
    catch (error) {
        // Verificar se o erro é uma instância de Error
        if (error instanceof Error) {
            console.error('Erro ao realizar login:', error.message);
            return res.status(500).json({ error: 'Erro ao realizar login', details: error.message });
        }
        else {
            console.error('Erro desconhecido:', error);
            return res.status(500).json({ error: 'Erro desconhecido ao realizar login' });
        }
    }
};
exports.login = login;
