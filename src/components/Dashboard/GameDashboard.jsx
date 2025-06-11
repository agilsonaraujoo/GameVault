import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Header from './Header';
import GameCard from './GameCard';
import EmptyState from './EmptyState';
import GameFormModal from '../Modals/GameFormModal';
import BulkAddModal from '../Modals/BulkAddModal';
import GameDetailModal from '../Modals/GameDetailModal';
import ConfirmDeleteModal from '../Modals/ConfirmDeleteModal';

const GameDashboard = ({ user, games, onSignOut, onSaveGame, onDeleteGame, onBulkSave, selectedGames, onToggleGameSelection, onDeleteSelectedGames, isSelectionMode, onToggleSelectionMode }) => {
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [isBulkModalOpen, setBulkModalOpen] = useState(false);
    const [isDetailModalOpen, setDetailModalOpen] = useState(false);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);
    const [gameToDelete, setGameToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddNewGame = () => { setSelectedGame(null); setFormModalOpen(true); };
    const handleAddMultipleGames = () => { setBulkModalOpen(true); };
    const handleEditGame = (game) => { setSelectedGame(game); setFormModalOpen(true); };
    const handleViewDetails = (game) => { setSelectedGame(game); setDetailModalOpen(true); };
    const handleDeleteRequest = (game) => { setGameToDelete(game); setConfirmModalOpen(true); };

    const handleConfirmDelete = () => {
        if (!gameToDelete) return;
        onDeleteGame(gameToDelete.id);
        setConfirmModalOpen(false);
        setGameToDelete(null);
    };

    const handleRegisterFromSuggestion = (gameName) => {
        setDetailModalOpen(false); // Fecha o modal de detalhes
        setSelectedGame({ name: gameName }); // Pré-preenche o nome
        setFormModalOpen(true); // Abre o modal de formulário
    };

    const handleFormSave = (game) => {
        onSaveGame(game);
        setFormModalOpen(false);
        setSelectedGame(null);
    }
    
    const filteredGames = games.filter(game => 
        game.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Header 
                user={user} 
                onSignOut={onSignOut} 
                onAddNewGame={handleAddNewGame}
                onAddMultiple={handleAddMultipleGames}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedGamesCount={selectedGames.size}
                onDeleteSelected={onDeleteSelectedGames}
                isSelectionMode={isSelectionMode}
                onToggleSelectionMode={onToggleSelectionMode}
            />
            <main className="p-2 sm:p-6 lg:p-8">
                {games.length > 0 ? (
                    filteredGames.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredGames.map(game => (
                                <GameCard 
                                    key={game.id} 
                                    game={game} 
                                    onEdit={() => handleEditGame(game)}
                                    onDelete={() => handleDeleteRequest(game)}
                                    onView={() => handleViewDetails(game)}
                                    isSelected={selectedGames.has(game.id)}
                                    onToggleSelection={() => onToggleGameSelection(game.id)}
                                    isSelectionMode={isSelectionMode}
                                    onToggleSelectionMode={onToggleSelectionMode}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 px-6">
                            <Search size={64} className="mx-auto text-gray-600" />
                            <h3 className="mt-4 text-2xl font-semibold">Nenhum resultado encontrado</h3>
                            <p className="mt-2 text-gray-400">Tente pesquisar com outros termos para "{searchTerm}".</p>
                        </div>
                    )
                ) : (
                    <EmptyState onAddNewGame={handleAddNewGame} />
                )}
            </main>

            {isFormModalOpen && <GameFormModal isOpen={isFormModalOpen} onClose={() => setFormModalOpen(false)} onSave={handleFormSave} gameToEdit={selectedGame} />}
            {isBulkModalOpen && <BulkAddModal isOpen={isBulkModalOpen} onClose={() => setBulkModalOpen(false)} onBulkSave={onBulkSave} />}
            {isDetailModalOpen && <GameDetailModal isOpen={isDetailModalOpen} onClose={() => setDetailModalOpen(false)} game={selectedGame} onRegisterSuggested={handleRegisterFromSuggestion} />}
            {isConfirmModalOpen && <ConfirmDeleteModal isOpen={isConfirmModalOpen} onClose={() => setConfirmModalOpen(false)} onConfirm={handleConfirmDelete} gameName={gameToDelete?.name}/>}
        </>
    );
};

export default GameDashboard;
