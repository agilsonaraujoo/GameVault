import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import 'dotenv/config';

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

// --- ROTAS DA API ---

// app.use('/api/games', gameRoutes);

// --- ROTA PARA O FRONTEND ---
app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
