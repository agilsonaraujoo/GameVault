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
// Adiciona cabeçalhos de segurança para permitir o login com o Google
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    next();
});

// Configuração do CORS para permitir requisições de origens específicas.
const allowedOrigins = [
    'https://gamevault.onrender.com', // Frontend em produção
    'http://localhost:5173'           // Frontend em desenvolvimento
];

const corsOptions = {
    origin: function (origin, callback) {
        // Permitir requisições sem 'origin' (ex: Postman) ou se a origem estiver na lista
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.error(`CORS Blocked: Origin ${origin} is not in the allowed list.`);
            callback(new Error('A política de CORS não permite acesso a partir desta origem.'));
        }
    },
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));


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
