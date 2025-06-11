import React, { useState } from 'react';
import { Gamepad2, PlusCircle, Layers, LogOut, Search, Trash2, CheckSquare, X, Menu } from 'lucide-react';
import ConfirmDeleteModal from '../Modals/ConfirmDeleteModal';

const Header = ({ user, onSignOut, onAddNewGame, onAddMultiple, searchTerm, onSearchChange, selectedGamesCount, onDeleteSelected, isSelectionMode, onToggleSelectionMode }) => {
    const [isConfirmBulkDeleteOpen, setConfirmBulkDeleteOpen] = useState(false);
    const [isMenuOpen, setMenuOpen] = useState(false); // State for mobile menu

    const handleConfirmDelete = () => {
        onDeleteSelected();
        setConfirmBulkDeleteOpen(false);
    };

    // Helper to close menu when an action is taken
    const handleMenuAction = (action) => {
        action();
        setMenuOpen(false);
    };

    return (
        <>
            <header className="bg-gray-800/80 backdrop-blur-sm sticky top-0 z-40 shadow-lg">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center gap-3">
                            <Gamepad2 className="h-8 w-8 text-indigo-400" />
                            <span className="text-2xl font-bold hidden sm:inline">GameVault</span>
                        </div>
                        
                        {/* Search Bar */}
                        <div className="flex-1 flex justify-center px-2 sm:px-4">
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

                        {/* Desktop Buttons */}
                        <div className="hidden md:flex flex-shrink-0 items-center justify-end flex-wrap gap-2">
                            {isSelectionMode ? (
                                <>
                                    {selectedGamesCount > 0 && (
                                        <button 
                                            onClick={() => setConfirmBulkDeleteOpen(true)} 
                                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors"
                                        >
                                            <Trash2 size={20} />
                                            <span className="hidden lg:inline">Excluir {selectedGamesCount} {selectedGamesCount > 1 ? 'itens' : 'item'}</span>
                                        </button>
                                    )}
                                    <button 
                                        onClick={onToggleSelectionMode} 
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors"
                                    >
                                        <X size={20} />
                                        <span className="hidden lg:inline">Cancelar</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={onAddNewGame} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors">
                                        <PlusCircle size={20} />
                                        <span className="hidden lg:inline">Adicionar Jogo</span>
                                    </button>
                                    <button onClick={onAddMultiple} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-500 transition-colors">
                                        <Layers size={20} />
                                        <span className="hidden lg:inline">Adicionar Vários</span>
                                    </button>
                                    <button 
                                        onClick={onToggleSelectionMode} 
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors"
                                    >
                                        <CheckSquare size={20} />
                                        <span className="hidden lg:inline">Selecionar</span>
                                    </button>
                                </>
                            )}
                            <div className="flex items-center gap-2 ml-2">
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

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button onClick={() => setMenuOpen(true)} className="p-2 rounded-md hover:bg-gray-700">
                                <Menu size={28} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Panel */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 z-50">
                    {/* Overlay */}
                    <div className="fixed inset-0 bg-black/60" onClick={() => setMenuOpen(false)}></div>
                    
                    {/* Menu Content */}
                    <div className="fixed top-0 right-0 h-full w-72 bg-gray-900 shadow-xl p-6 flex flex-col">
                        {/* Menu Header */}
                        <div className="flex items-center justify-between pb-6 border-b border-gray-700">
                            <div className="flex items-center gap-3">
                                <img 
                                    src={user.picture || `https://placehold.co/40x40/7c3aed/ffffff?text=${user.name ? user.name.charAt(0).toUpperCase() : 'U'}`}
                                    alt={user.name || 'Usuário'}
                                    className="w-10 h-10 rounded-full border-2 border-indigo-400"
                                />
                                <span className="font-semibold">{user.name || 'Usuário'}</span>
                            </div>
                            <button onClick={() => setMenuOpen(false)} className="p-2 rounded-md hover:bg-gray-700">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Menu Actions */}
                        <nav className="flex-1 mt-6">
                            <ul className="flex flex-col gap-2">
                                {isSelectionMode ? (
                                    <>
                                        {selectedGamesCount > 0 && (
                                            <li><button onClick={() => handleMenuAction(() => setConfirmBulkDeleteOpen(true))} className="w-full flex items-center gap-4 px-4 py-3 text-left rounded-lg text-red-400 hover:bg-red-900/50 transition-colors"><Trash2 size={22} /><span>Excluir {selectedGamesCount} {selectedGamesCount > 1 ? 'itens' : 'item'}</span></button></li>
                                        )}
                                        <li><button onClick={() => handleMenuAction(onToggleSelectionMode)} className="w-full flex items-center gap-4 px-4 py-3 text-left rounded-lg hover:bg-gray-700 transition-colors"><X size={22} /><span>Cancelar Seleção</span></button></li>
                                    </>
                                ) : (
                                    <>
                                        <li><button onClick={() => handleMenuAction(onAddNewGame)} className="w-full flex items-center gap-4 px-4 py-3 text-left rounded-lg hover:bg-gray-700 transition-colors"><PlusCircle size={22} /><span>Adicionar Jogo</span></button></li>
                                        <li><button onClick={() => handleMenuAction(onAddMultiple)} className="w-full flex items-center gap-4 px-4 py-3 text-left rounded-lg hover:bg-gray-700 transition-colors"><Layers size={22} /><span>Adicionar Vários</span></button></li>
                                        <li><button onClick={() => handleMenuAction(onToggleSelectionMode)} className="w-full flex items-center gap-4 px-4 py-3 text-left rounded-lg hover:bg-gray-700 transition-colors"><CheckSquare size={22} /><span>Selecionar Itens</span></button></li>
                                    </>
                                )}
                            </ul>
                        </nav>
                        
                        {/* Logout Button */}
                        <div className="mt-6 pt-6 border-t border-gray-700">
                            <button onClick={() => handleMenuAction(onSignOut)} className="w-full flex items-center gap-4 px-4 py-3 text-left rounded-lg hover:bg-gray-700 transition-colors">
                                <LogOut size={22} />
                                <span>Sair</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals remain unchanged */}
            {isConfirmBulkDeleteOpen && (
                <ConfirmDeleteModal
                    isOpen={isConfirmBulkDeleteOpen}
                    onClose={() => setConfirmBulkDeleteOpen(false)}
                    onConfirm={handleConfirmDelete}
                    gameName={`${selectedGamesCount} ${selectedGamesCount > 1 ? 'jogos' : 'jogo'}`}
                />
            )}
        </>
    );
};

export default Header;
