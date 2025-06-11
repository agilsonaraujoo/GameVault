import React from 'react';
import { Trash2, Edit, Eye } from 'lucide-react';
import PriceTag from './PriceTag';

const GameCard = ({ game, onEdit, onDelete, onView, isSelected, onToggleSelection, isSelectionMode }) => {
    const placeholderImage = `https://placehold.co/600x400/111827/4f46e5?text=${encodeURIComponent(game.name)}`;
    const displayPlatforms = Array.isArray(game.platforms) ? game.platforms.join(', ') : '';

    const handleCardClick = () => {
        if (isSelectionMode) {
            onToggleSelection();
        } else {
            onView();
        }
    };

    const handleButtonClick = (e, action) => {
        e.stopPropagation();
        action();
    };

    const cardClasses = `
        bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 
        hover:shadow-indigo-500/30 hover:scale-[1.02] flex flex-col relative cursor-pointer 
        ${isSelectionMode && isSelected ? 'ring-2 ring-indigo-500' : ''}
    `;

    const imageClasses = `
        w-full h-full object-contain transition-opacity duration-300 
        ${isSelectionMode && isSelected ? 'opacity-70' : 'opacity-100'}
    `;

    return (
        <div className={cardClasses} onClick={handleCardClick}>
            {isSelectionMode && (
                <input 
                    type="checkbox" 
                    checked={isSelected} 
                    onChange={onToggleSelection}
                    onClick={e => e.stopPropagation()}
                    className="absolute top-3 right-3 h-5 w-5 rounded bg-gray-900/50 border-gray-600 text-indigo-600 focus:ring-indigo-500 z-20 cursor-pointer"
                />
            )}
            <div className="relative w-full h-48 bg-black/30">
                 <img 
                    src={game.imageUrl || placeholderImage} 
                    alt={`Capa do jogo ${game.name}`} 
                    className={imageClasses}
                    onError={(e) => { e.target.onerror = null; e.target.src=placeholderImage; }} 
                 />
                 <PriceTag price={game.price} />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <p className="text-sm font-semibold text-indigo-400 truncate" title={displayPlatforms}>{displayPlatforms || "Plataformas não especificadas"}</p>
                <h3 className="text-xl font-bold truncate mt-1" title={game.name}>{game.name}</h3>
                <p className="text-gray-400 h-12 overflow-hidden text-ellipsis mt-2 text-sm flex-grow" title={game.description}>{game.description || "Sem descrição."}</p>
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={e => handleButtonClick(e, onView)} className="p-2 rounded-full hover:bg-gray-700 transition-colors z-10" aria-label="Ver detalhes"><Eye size={20} className="text-gray-300"/></button>
                    <button onClick={e => handleButtonClick(e, onEdit)} className="p-2 rounded-full hover:bg-gray-700 transition-colors z-10" aria-label="Editar jogo"><Edit size={20} className="text-green-500"/></button>
                    <button onClick={e => handleButtonClick(e, onDelete)} className="p-2 rounded-full hover:bg-gray-700 transition-colors z-10" aria-label="Excluir jogo"><Trash2 size={20} className="text-red-500"/></button>
                </div>
            </div>
        </div>
    );
};

export default GameCard;
