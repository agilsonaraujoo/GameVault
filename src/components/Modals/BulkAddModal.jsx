import React, { useState } from 'react';
import Modal from './Modal';
import { Sparkles, Layers } from 'lucide-react';

// --- IMPORTANTE: SEGURANÇA DA CHAVE DE API ---
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// --- FIM DA SEGURANÇA DA CHAVE DE API ---

const BulkAddModal = ({ isOpen, onClose, onBulkSave }) => {
    const [gameNamesText, setGameNamesText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [processedGames, setProcessedGames] = useState([]);
    const [apiError, setApiError] = useState('');

    const handleProcessGames = async () => {
        console.log('Botão Processar Jogos com IA clicado');
        console.log('Valor de GEMINI_API_KEY:', GEMINI_API_KEY ? '*** (chave presente)' : 'NÃO ENCONTRADA');
        
        if (!gameNamesText.trim()) {
            const errorMsg = "Por favor, insira os nomes dos jogos.";
            console.error(errorMsg);
            alert(errorMsg);
            return;
        }
        
        if (!GEMINI_API_KEY) {
            const errorMsg = "Chave de API do Gemini não configurada. Não é possível processar os jogos. Verifique se o arquivo .env está configurado corretamente.";
            console.error(errorMsg);
            console.error('Variáveis de ambiente:', import.meta.env);
            alert(errorMsg);
            setApiError("Chave de API do Gemini não configurada. Verifique o console para mais detalhes.");
            return;
        }

        setIsProcessing(true);
        setProcessedGames([]);
        setApiError('');

        const gameNameList = gameNamesText.split('\n').map(name => name.trim()).filter(name => name);
        if (gameNameList.length === 0) {
            alert("Nenhum nome de jogo válido encontrado.");
            setIsProcessing(false);
            return;
        }

        const gamesData = [];

        for (const name of gameNameList) {
                        const prompt = `Para o jogo "${name}", forneça uma descrição muito curta (1-2 frases), as plataformas principais (PC, PlayStation 5, Xbox Series X/S, Nintendo Switch etc.), o preço aproximado em BRL (ou "Gratuito") e um link de uma loja digital (se disponível). **Importante: Se um preço específico não for encontrado, o valor do preço deve ser uma string vazia.** Responda em formato JSON com chaves: "name" (string, o nome original), "description" (string), "platforms" (array de strings), "price" (string), "imageUrl" (string, deixe vazio por enquanto), "dealLink" (string).`;
            try {
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
                const payload = {
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: "application/json" }
                };
                const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                if (!response.ok) {
                    const errorData = await response.json();
                    console.warn(`Erro ao processar "${name}": ${errorData.error?.message || 'Erro desconhecido'}`);
                    gamesData.push({ name, description: 'Não foi possível obter dados.', platforms: [], price: '', imageUrl: '', dealLink: '', error: true });
                    continue;
                }
                const result = await response.json();
                if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                    const parsedJson = JSON.parse(result.candidates[0].content.parts[0].text);
                    gamesData.push({ 
                        name: parsedJson.name || name, // Usa o nome original como fallback
                        description: parsedJson.description || '', 
                        platforms: parsedJson.platforms || [], 
                        price: parsedJson.price || '', 
                        imageUrl: parsedJson.imageUrl || '', 
                        dealLink: parsedJson.dealLink || '' 
                    });
                } else {
                    gamesData.push({ name, description: 'Resposta da API inválida.', platforms: [], price: '', imageUrl: '', dealLink: '', error: true });
                }
            } catch (error) {
                console.error(`Erro crítico ao processar "${name}":`, error);
                gamesData.push({ name, description: `Erro: ${error.message}`, platforms: [], price: '', imageUrl: '', dealLink: '', error: true });
                setApiError(`Erro ao processar "${name}": ${error.message}. Verifique o console.`);
            }
        }
        setProcessedGames(gamesData);
        setIsProcessing(false);
    };

    const handleSaveAll = () => {
        const gamesToSave = processedGames.filter(game => !game.error && game.name);
        if (gamesToSave.length > 0) {
            onBulkSave(gamesToSave);
            onClose(); // Fecha o modal após salvar
            setGameNamesText(''); // Limpa a área de texto
            setProcessedGames([]); // Limpa os jogos processados
        } else {
            alert("Nenhum jogo válido para salvar. Verifique os erros ou processe novos jogos.");
        }
    };

    const handleClose = () => {
        setGameNamesText('');
        setProcessedGames([]);
        setApiError('');
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Adicionar Múltiplos Jogos">
            <div className="p-6 space-y-4 max-h-[80vh] flex flex-col">
                {apiError && <div className="p-3 bg-red-800/50 border border-red-700 text-red-300 rounded-md text-sm"><strong>Erro:</strong> {apiError}</div>}
                <div>
                    <label htmlFor="gameNames" className="block text-sm font-medium text-gray-300 mb-1">
                        Nomes dos Jogos (um por linha)
                    </label>
                    <textarea
                        id="gameNames"
                        value={gameNamesText}
                        onChange={e => setGameNamesText(e.target.value)}
                        rows="6"
                        placeholder="Exemplo:\nCyberpunk 2077\nThe Witcher 3\nStardew Valley"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                        disabled={isProcessing || (processedGames.length > 0 && !GEMINI_API_KEY)}
                    />
                </div>
                <button 
                    type="button" 
                    onClick={handleProcessGames} 
                    disabled={isProcessing || !gameNamesText.trim() || !GEMINI_API_KEY}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-500 transition-colors disabled:bg-sky-800 disabled:cursor-not-allowed"
                >
                    <Sparkles size={16}/> {isProcessing ? 'Processando com IA...' : 'Processar Jogos com IA ✨'}
                </button>

                {processedGames.length > 0 && (
                    <div className="mt-4 space-y-3 flex-grow overflow-y-auto border border-gray-700 rounded-md p-3 bg-gray-900/30">
                        <h4 className="text-md font-semibold text-white mb-2">Jogos Processados ({processedGames.filter(g => !g.error).length} válidos):</h4>
                        {processedGames.map((game, index) => (
                            <div key={index} className={`p-2 rounded-md ${game.error ? 'bg-red-800/30 border border-red-700/50' : 'bg-gray-700/70'}`}>
                                <p className={`font-semibold ${game.error ? 'text-red-400' : 'text-indigo-300'}`}>{game.name}</p>
                                <p className="text-xs text-gray-400 truncate">{game.description}</p>
                                {game.error && <p className="text-xs text-red-500">Falha ao processar.</p>}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-gray-700/50 px-6 py-3 flex justify-between items-center border-t border-gray-700">
                <button 
                    type="button" 
                    onClick={handleClose} 
                    className="px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-500 transition-colors"
                >
                    Cancelar
                </button>
                <button 
                    type="button" 
                    onClick={handleSaveAll} 
                    disabled={isProcessing || processedGames.filter(g => !g.error).length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 transition-colors disabled:bg-indigo-800 disabled:cursor-not-allowed"
                >
                    <Layers size={18}/> Salvar {processedGames.filter(g => !g.error).length || ''} Jogos
                </button>
            </div>
        </Modal>
    );
};

export default BulkAddModal;
