import React from 'react';
import { Gamepad2, PlusCircle, Layers, LogOut, Search } from 'lucide-react';

const Header = ({ user, onSignOut, onAddNewGame, onAddMultiple, searchTerm, onSearchChange }) => (
    <header className="bg-gray-800/80 backdrop-blur-sm sticky top-0 z-40 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 gap-4">
                <div className="flex-shrink-0 flex items-center gap-3">
                    <Gamepad2 className="h-8 w-8 text-indigo-400" />
                    <span className="text-2xl font-bold hidden sm:inline">GameVault</span>
                </div>
                
                <div className="flex-1 flex justify-center px-4">
                    <div className="w-full max-w-xl relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                             <Search className="text-gray-400" size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Pesquisar jogos..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full bg-gray-700/80 border border-transparent rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="flex-shrink-0 flex items-center gap-2">
                     <button onClick={onAddNewGame} className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors">
                        <PlusCircle size={20} />
                         <span className="hidden xl:inline">Adicionar Jogo</span>
                    </button>
                    <button onClick={onAddMultiple} className="hidden md:flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-500 transition-colors">
                        <Layers size={20} />
                         <span className="hidden xl:inline">Adicionar Vários</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <img 
                            src={user.picture || `https://placehold.co/40x40/7c3aed/ffffff?text=${user.name ? user.name.charAt(0).toUpperCase() : 'U'}`}
                            alt={user.name || 'Usuário'}
                            className="w-10 h-10 rounded-full border-2 border-indigo-400"
                        />
                         <button onClick={onSignOut} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                            <LogOut size={22} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
         <div className="md:hidden fixed bottom-6 right-6 flex flex-col gap-3 z-50">
            <button onClick={onAddMultiple} className="flex items-center justify-center w-14 h-14 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-500 transition-all duration-300">
                <Layers size={28} />
            </button>
            <button onClick={onAddNewGame} className="flex items-center justify-center w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-500 transition-all duration-300">
                <PlusCircle size={28} />
            </button>
        </div>
    </header>
);

export default Header;
