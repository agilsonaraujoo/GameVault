import React from 'react';
import { Trash2, Edit, Eye } from 'lucide-react';
import PriceTag from './PriceTag';

const GameCard = ({ game, onEdit, onDelete, onView }) => {
    const placeholderImage = `https://placehold.co/600x400/111827/4f46e5?text=${encodeURIComponent(game.name)}`;
    const displayPlatforms = Array.isArray(game.platforms) ? game.platforms.join(', ') : '';

    return (
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-indigo-500/30 hover:scale-[1.02] flex flex-col">
            <div className="relative w-full h-48 bg-black/30">
                 <img 
                    src={game.imageUrl || placeholderImage} 
                    alt={`Capa do jogo ${game.name}`} 
                    className="w-full h-full object-contain" 
                    onError={(e) => { e.target.onerror = null; e.target.src=placeholderImage; }} 
                 />
                 <PriceTag price={game.price} />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <p className="text-sm font-semibold text-indigo-400 truncate" title={displayPlatforms}>{displayPlatforms || "Plataformas não especificadas"}</p>
                <h3 className="text-xl font-bold truncate mt-1" title={game.name}>{game.name}</h3>
                <p className="text-gray-400 h-12 overflow-hidden text-ellipsis mt-2 text-sm flex-grow" title={game.description}>{game.description || "Sem descrição."}</p>
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onView} className="p-2 rounded-full hover:bg-gray-700 transition-colors" aria-label="Ver detalhes"><Eye size={20} className="text-gray-300"/></button>
                    <button onClick={onEdit} className="p-2 rounded-full hover:bg-gray-700 transition-colors" aria-label="Editar jogo"><Edit size={20} className="text-green-500"/></button>
                    <button onClick={onDelete} className="p-2 rounded-full hover:bg-gray-700 transition-colors" aria-label="Excluir jogo"><Trash2 size={20} className="text-red-500"/></button>
                </div>
            </div>
        </div>
    );
};

export default GameCard;
