import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3007; // Alterado para 3007 para evitar conflitos

// Configuração do CORS
app.use(cors({
    origin: '*', // Em produção, substitua pelo seu domínio
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para log de requisições
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Serve os arquivos estáticos da pasta 'dist'
app.use(express.static(path.join(__dirname, 'dist')));

// Para qualquer outra rota, serve o index.html (necessário para o roteamento do lado do cliente do React)
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor Node.js rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});
