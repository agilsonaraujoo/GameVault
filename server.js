import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import 'dotenv/config';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
// import gameRoutes from './routes/gameRoutes.js';

// --- CONFIGURAÇÃO INICIAL ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARE ---
// Configuração do CORS para permitir requisições apenas da URL do frontend.
const allowedOrigin = process.env.CORS_ORIGIN;
console.log(`[INFO] CORS Origin configurado para aceitar: ${allowedOrigin}`);

const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// --- MIDDLEWARE DE SEGURANÇA PARA OAUTH ---
// Headers para permitir a comunicação segura (postMessage) entre o pop-up de login do Google e o seu site.
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    next();
});
app.use(express.json());


app.use(express.static(path.join(process.cwd(), 'dist')));

// --- CONFIGURAÇÃO DO GOOGLE AUTH ---
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const users = []; // Repositório de usuários em memória para demonstração
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key'; // Use uma variável de ambiente em produção

// --- ROTAS DA API ---
app.post('/api/auth/google/callback', async (req, res) => {
    const { credential } = req.body;
    if (!credential) {
        return res.status(400).json({ message: 'Nenhuma credencial fornecida' });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub, email, name, picture } = payload;

        let user = users.find(u => u.googleId === sub);
        if (!user) {
            user = { googleId: sub, email, name, picture };
            users.push(user);
        }

        const token = jwt.sign({ userId: user.googleId, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, user });

    } catch (error) {
        console.error('Erro ao verificar o token do Google:', error);
        res.status(401).json({ message: 'Token do Google inválido' });
    }
});

// app.use('/api/games', gameRoutes);

// --- ROTA PARA O FRONTEND ---
app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
