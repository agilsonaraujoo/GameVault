import React, { useState, useEffect, useCallback } from 'react';
import { Gamepad2 } from 'lucide-react';
import AuthRouter from './components/Auth/AuthRouter';
import GameDashboard from './components/Dashboard/GameDashboard';
import LoadingScreen from './components/Common/LoadingScreen';
import NotificationToast from './components/Common/NotificationToast';
import apiService from './services/api';

export default function App() {
    const [user, setUser] = useState(null);
    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
        const [notification, setNotification] = useState({ message: '', type: 'success' });
    const [selectedGames, setSelectedGames] = useState(new Set());
    const [isSelectionMode, setSelectionMode] = useState(false);

    // Carrega o usuário do localStorage na renderização inicial
    useEffect(() => {
        const storedUser = localStorage.getItem('game-catalog-user');
        if (storedUser && storedUser !== 'undefined') {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Falha ao analisar o usuário do localStorage, limpando.", error);
                localStorage.removeItem('game-catalog-user');
            }
        }
        setIsLoading(false);
    }, []);

    // Carrega/salva os jogos do localStorage com base no usuário
    useEffect(() => {
        if (user) {
            const userIdentifier = user.sub || user.id; // Google usa 'sub', login personalizado usa 'id'
            const storedGames = localStorage.getItem(`games_${userIdentifier}`);
            setGames(storedGames ? JSON.parse(storedGames) : []);
        } else {
            setGames([]);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            try {
                const userIdentifier = user.sub || user.id;
                const gamesToStore = games.map(game => {
                    const { imageUrl, ...rest } = game;
                    if (imageUrl && imageUrl.startsWith('http')) {
                        return game;
                    }
                    return { ...rest, imageUrl: '' }; // Remove imagens base64 antes de salvar
                });
                localStorage.setItem(`games_${userIdentifier}`, JSON.stringify(gamesToStore));
            } catch (error) {
                console.error("Failed to save games to localStorage:", error);
                if (error.name === 'QuotaExceededError') {
                    alert('Não foi possível salvar os jogos. O armazenamento local está cheio. Tente remover alguns jogos ou limpar o cache do navegador.');
                }
            }
        }
    }, [games, user]);

    const getFirstName = (profile) => {
        if (!profile) return '';
        return profile.given_name || (profile.name || '').split(' ')[0];
    };
    
            const handleSetCurrentUser = useCallback((profile) => {
        if (!profile) return;
        const firstName = getFirstName(profile);
        setNotification({ message: `Bem-vindo(a), ${firstName}!`, type: 'success' });
        setUser(profile);
        localStorage.setItem('game-catalog-user', JSON.stringify(profile));
    }, []);



    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('game-catalog-user');
        if (window.google && window.google.accounts && window.google.accounts.id) {
            window.google.accounts.id.disableAutoSelect();
        }
    };

    const handleSaveGame = (gameToSave) => {
        if (gameToSave.id) {
            setGames(games.map(game => game.id === gameToSave.id ? gameToSave : game));
        } else {
            const newGame = { ...gameToSave, id: Date.now().toString(), createdAt: new Date().toISOString() };
            setGames([newGame, ...games].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
        }
    };

     const handleBulkSave = (newGames) => {
        const gamesWithIds = newGames.map(game => ({
            ...game,
            id: `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // ID mais robusto
            createdAt: new Date().toISOString()
        }));
        setGames(prevGames => [...gamesWithIds, ...prevGames].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    };

    const handleDeleteGame = (gameId) => {
        setGames(games.filter(game => game.id !== gameId));
    };

    const toggleGameSelection = (gameId) => {
        setSelectedGames(prevSelected => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(gameId)) {
                newSelected.delete(gameId);
            } else {
                newSelected.add(gameId);
            }
            return newSelected;
        });
    };

    const deleteSelectedGames = () => {
        setGames(prevGames => prevGames.filter(game => !selectedGames.has(game.id)));
        setSelectedGames(new Set()); // Limpa a seleção após a exclusão
        setSelectionMode(false); // Sai do modo de seleção
    };

    const toggleSelectionMode = () => {
        setSelectionMode(prevMode => {
            // Ao sair do modo de seleção, limpa os jogos selecionados
            if (prevMode) {
                setSelectedGames(new Set());
            }
            return !prevMode;
        });
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            <NotificationToast notification={notification} onClear={() => setNotification({ message: '' })} />
            {user ? (
                <GameDashboard
                    user={user}
                    games={games}
                    onSignOut={handleLogout}
                    onSaveGame={handleSaveGame}
                    onDeleteGame={handleDeleteGame}
                    onBulkSave={handleBulkSave}
                    selectedGames={selectedGames}
                    onToggleGameSelection={toggleGameSelection}
                    onDeleteSelectedGames={deleteSelectedGames}
                    isSelectionMode={isSelectionMode}
                    onToggleSelectionMode={toggleSelectionMode}
                />
            ) : (
                <AuthRouter onLoginSuccess={handleSetCurrentUser} />
            )}
        </div>
    );
}
