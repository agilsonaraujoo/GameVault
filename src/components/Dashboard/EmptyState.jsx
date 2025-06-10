import React from 'react';
import { Gamepad2, PlusCircle } from 'lucide-react';

const EmptyState = ({ onAddNewGame }) => (
    <div className="text-center py-20 px-6">
        <Gamepad2 size={64} className="mx-auto text-gray-600" />
        <h3 className="mt-4 text-2xl font-semibold">O seu catálogo está vazio</h3>
        <p className="mt-2 text-gray-400">Comece por adicionar o seu primeiro jogo para montar a sua coleção.</p>
        <button 
            onClick={onAddNewGame} 
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors"
        >
            <PlusCircle size={20} /> Adicionar Primeiro Jogo
        </button>
    </div>
);

export default EmptyState;
