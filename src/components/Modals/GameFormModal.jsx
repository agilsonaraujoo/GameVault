import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import Modal from './Modal';
import { ALL_PLATFORMS } from '../../constants/gameConstants';

// --- IMPORTANTE: SEGURANÇA DA CHAVE DE API ---
// NUNCA incorpore chaves de API diretamente no seu código de frontend em uma aplicação real.
// Isto é APENAS PARA FINS DE DEMONSTRAÇÃO.
// Chaves de API devem ser armazenadas de forma segura em um servidor backend e acessadas através de chamadas de API autenticadas.
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// --- FIM DA SEGURANÇA DA CHAVE DE API ---

const GameFormModal = ({ isOpen, onClose, onSave, gameToEdit }) => {
    const [name, setName] = useState('');
    const [platforms, setPlatforms] = useState([]);
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [price, setPrice] = useState('');
    const [dealLink, setDealLink] = useState('');
    const [isGeneratingInfo, setIsGeneratingInfo] = useState(false);
    const [apiError, setApiError] = useState('');

    useEffect(() => {
        if (gameToEdit) {
            setName(gameToEdit.name || '');
            setPlatforms(Array.isArray(gameToEdit.platforms) ? gameToEdit.platforms : []);
            setDescription(gameToEdit.description || '');
            setImageUrl(gameToEdit.imageUrl || '');
            setPrice(gameToEdit.price || '');
            setDealLink(gameToEdit.dealLink || '');
        } else {
            // Reseta o formulário para um novo jogo
            setName(''); 
            setPlatforms([]); 
            setDescription(''); 
            setImageUrl(''); 
            setPrice(''); 
            setDealLink('');
        }
        setApiError(''); // Limpa o erro da API quando o modal abre ou gameToEdit muda
    }, [gameToEdit, isOpen]);

    const handlePlatformChange = (platformName) => {
        setPlatforms(prev => 
            prev.includes(platformName) 
                ? prev.filter(p => p !== platformName) 
                : [...prev, platformName]
        );
    };

    const handleGenerateInfo = async () => {
        if (!name) {
            alert("Por favor, insira o nome do jogo primeiro.");
            return;
        }
        if (!GEMINI_API_KEY) {
            alert("Chave de API do Gemini não configurada. Não é possível gerar informações.");
            setApiError("Chave de API do Gemini não configurada.")
            return;
        }
        setIsGeneratingInfo(true);
        setApiError('');
                const prompt = `Baseado no nome do jogo "${name}", gere o seguinte em **português do Brasil**: uma descrição muito curta (1-2 frases), identifique as plataformas em que ele está disponível, forneça seu preço atual em BRL de uma loja digital principal (como Steam, Nuuvem, Epic Games, PlayStation Store, Xbox Store) e um link direto para a página de compra dessa loja. Se o jogo for gratuito (free-to-play), o preço deve ser a string "Gratuito". O valor do preço deve usar uma **vírgula como separador decimal** (ex: "299,90") ou a palavra "Gratuito". **Importante: Se um preço específico não for encontrado, o valor do preço deve ser uma string vazia.** O link deve ser válido. As plataformas possíveis são: ${ALL_PLATFORMS.join(', ')}. Forneça a resposta em formato JSON com as chaves "description" (string), "platforms" (array de strings), "price" (string) e "dealLink" (string).`;
        
        try {
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
            const payload = {
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                  responseMimeType: "application/json",
                  // Nota: responseSchema pode não ser suportado por todos os modelos ou versões do Gemini da mesma forma.
                // Por simplicidade, vamos analisar a resposta de texto diretamente.
              }
            };

            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error (${response.status}): ${errorData.error?.message || 'Erro desconhecido'}`);
            }
            const result = await response.json();
            
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                const parsedJson = JSON.parse(result.candidates[0].content.parts[0].text);
                setDescription(parsedJson.description || '');
                setPlatforms((parsedJson.platforms || []).filter(p => ALL_PLATFORMS.includes(p)));
                setPrice(parsedJson.price || '');
                setDealLink(parsedJson.dealLink || '');
            } else {
                throw new Error('Resposta da API inválida ou formato inesperado.');
            }
        } catch (error) {
            console.error("Erro ao gerar informações:", error);
            setApiError(`Não foi possível gerar as informações: ${error.message}`);
            // alert(`Não foi possível gerar as informações. Verifique o console para mais detalhes ou se a chave de API é válida. Erro: ${error.message}`);
        } finally {
            setIsGeneratingInfo(false);
        }
    };
    


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || platforms.length === 0) { 
            alert("Nome e pelo menos uma plataforma são obrigatórios."); 
            return; 
        }
        onSave({ id: gameToEdit?.id, name, platforms, description, imageUrl, price, dealLink, createdAt: gameToEdit?.createdAt || new Date().toISOString() });
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={gameToEdit ? "Editar Jogo" : "Adicionar Novo Jogo"}>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    {apiError && <div className="p-3 bg-red-800/50 border border-red-700 text-red-300 rounded-md text-sm"><strong>Erro:</strong> {apiError}</div>}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nome do Jogo</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                     <button type="button" onClick={handleGenerateInfo} disabled={isGeneratingInfo || !GEMINI_API_KEY} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-500 transition-colors disabled:bg-sky-800 disabled:cursor-not-allowed">
                        <Sparkles size={16}/> {isGeneratingInfo ? 'Gerando...' : 'Gerar Informações com IA ✨'}
                     </button>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Plataformas</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {ALL_PLATFORMS.map(p => (
                                <label key={p} className="flex items-center space-x-2 cursor-pointer bg-gray-700 p-2 rounded-md hover:bg-gray-600 transition-colors has-[:checked]:bg-indigo-600 has-[:checked]:text-white">
                                    <input type="checkbox" checked={platforms.includes(p)} onChange={() => handlePlatformChange(p)} className="h-4 w-4 rounded bg-gray-900 border-gray-600 text-indigo-600 focus:ring-indigo-500 sr-only"/>
                                    <span>{p}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">URL da Capa do Jogo</label>
                        <input 
                            type="url" 
                            value={imageUrl} 
                            onChange={e => setImageUrl(e.target.value)} 
                            placeholder="https://exemplo.com/imagem.jpg" 
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {imageUrl && (
                            <div className="mt-2">
                                <p className="text-xs text-gray-400 mb-1">Pré-visualização:</p>
                                <img 
                                    src={imageUrl} 
                                    alt="Pré-visualização da capa" 
                                    className="h-24 object-cover rounded-md border border-gray-600"
                                    onError={(e) => {
                                        e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22200%22%20height%3D%22200%22%20fill%3D%22%23374151%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20fill%3D%22%239CA3AF%22%3EImagem%20n%C3%A3o%20encontrada%3C%2Ftext%3E%3C%2Fsvg%3E';
                                        e.target.alt = 'Imagem não encontrada';
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Descrição</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows="4" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">Preço (Ex: 299,90 ou Gratuito)</label>
                        <input type="text" id="price" placeholder='Ex: 299,90 ou "Gratuito"' value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                    <div>
                         <label htmlFor="dealLink" className="block text-sm font-medium text-gray-300 mb-1">Link da Oferta</label>
                        <input type="url" id="dealLink" placeholder="https://..." value={dealLink} onChange={e => setDealLink(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>

                </div>
                <div className="bg-gray-700/50 px-6 py-3 flex justify-end gap-3 border-t border-gray-700">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-500 transition-colors">Cancelar</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 transition-colors">Salvar Jogo</button>
                </div>
            </form>
        </Modal>
    );
};

export default GameFormModal;
