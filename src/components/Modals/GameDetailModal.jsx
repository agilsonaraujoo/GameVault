import React, { useState, useEffect } from 'react';
import { Sparkles, ShoppingCart, Plus, ExternalLink } from 'lucide-react';
import Modal from './Modal';
import PriceTag from '../Dashboard/PriceTag';

// --- IMPORTANTE: SEGURANÇA DA CHAVE DE API ---
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// --- FIM DA SEGURANÇA DA CHAVE DE API ---

const GameDetailModal = ({ isOpen, onClose, game, onRegisterSuggested }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [apiError, setApiError] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setSuggestions([]);
            setIsLoadingSuggestions(false);
            setApiError('');
        }
    }, [isOpen]);
    
    const handleSuggestGames = async () => {
        if (!game || !game.name) return;
        if (!GEMINI_API_KEY) {
            alert("Chave de API do Gemini não configurada. Não é possível gerar sugestões.");
            setApiError("Chave de API do Gemini não configurada.");
            return;
        }
        setIsLoadingSuggestions(true);
        setApiError('');
        const prompt = `Baseado no jogo "${game.name}", sugira 3 outros jogos semelhantes. Para cada sugestão, forneça o nome do jogo e uma frase curta em português do Brasil explicando o porquê da recomendação. Retorne um array JSON com objetos, cada um com as chaves "name" e "reason".`;
        try {
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
            const payload = {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                }
            };
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error (${response.status}): ${errorData.error?.message || 'Erro desconhecido'}`);
            }
            const result = await response.json();
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                const parsedJson = JSON.parse(result.candidates[0].content.parts[0].text);
                setSuggestions(parsedJson);
            } else {
                 throw new Error('Resposta da API inválida para sugestões');
            }
        } catch (error) {
            console.error("Erro ao sugerir jogos:", error);
            setApiError(`Não foi possível obter sugestões: ${error.message}`);
            setSuggestions([{ name: "Erro", reason: `Não foi possível obter sugestões. ${error.message}` }]);
        } finally {
            setIsLoadingSuggestions(false);
        }
    };

    if (!game) return null;
    const placeholderImage = `https://placehold.co/600x400/111827/4f46e5?text=${encodeURIComponent(game.name)}`;
    const displayPlatforms = Array.isArray(game.platforms) ? game.platforms.join(', ') : 'Não especificado';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={game.name || "Detalhes do Jogo"}>
            <div className="p-6 max-h-[80vh] overflow-y-auto space-y-4">
                {apiError && !isLoadingSuggestions && <div className="p-3 bg-red-800/50 border border-red-700 text-red-300 rounded-md text-sm"><strong>Erro:</strong> {apiError}</div>}
                <div className="relative bg-gray-900/50 rounded-lg mb-4 aspect-video">
                    <img 
                        src={game.imageUrl || placeholderImage} 
                        alt={`Capa do jogo ${game.name}`} 
                        className="w-full h-full object-contain rounded-lg" 
                        onError={(e) => { e.target.onerror = null; e.target.src=placeholderImage; }}
                    />
                     <PriceTag price={game.price} />
                </div>
                {/* <h3 className="text-3xl font-bold text-white">{game.name}</h3> Já está no título do Modal */}
                <p className="text-lg font-semibold text-indigo-400">{displayPlatforms}</p>
                <p className="text-gray-300 whitespace-pre-wrap text-sm">{game.description || "Nenhuma descrição fornecida."}</p>
                
                 {game.dealLink && (
                     <a 
                        href={game.dealLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition-colors"
                    >
                        <ShoppingCart size={20}/> Ver Melhor Oferta <ExternalLink size={16} className="ml-1 opacity-70"/>
                     </a>
                 )}

                <div>
                     <button 
                        onClick={handleSuggestGames} 
                        disabled={isLoadingSuggestions || !GEMINI_API_KEY}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 mb-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-500 transition-colors disabled:bg-teal-800 disabled:cursor-not-allowed"
                    >
                        <Sparkles size={16}/> {isLoadingSuggestions ? 'Procurando...' : 'Sugerir Jogos Semelhantes ✨'}
                     </button>
                     {isLoadingSuggestions && <div className="text-center p-2 text-gray-400">Buscando sugestões...</div>}
                     {suggestions.length > 0 && !isLoadingSuggestions && (
                        <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
                            <h4 className="font-bold mb-3 text-white">Sugestões para você:</h4>
                            <ul className="space-y-3">
                                {suggestions.map((suggestion, index) => (
                                    <li key={index} className="flex items-start sm:items-center justify-between gap-2 flex-col sm:flex-row">
                                        <div className="flex-1">
                                            <p className="font-semibold text-white">{suggestion.name}</p>
                                            <p className="text-sm text-gray-400">{suggestion.reason}</p>
                                        </div>
                                        {suggestion.name !== "Erro" && (
                                            <button 
                                                onClick={() => onRegisterSuggested(suggestion.name)} 
                                                className="flex-shrink-0 flex items-center gap-1.5 bg-indigo-600 text-white px-3 py-1.5 text-sm rounded-md hover:bg-indigo-500 transition-colors mt-2 sm:mt-0"
                                            >
                                                <Plus size={16}/>
                                                Cadastrar
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                     )}
                </div>
            </div>
            <div className="bg-gray-700/50 px-6 py-3 flex justify-end border-t border-gray-700">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-500 transition-colors">Fechar</button>
            </div>
        </Modal>
    );
};

export default GameDetailModal;
