import React, { useState, useEffect } from 'react';
import { Gamepad2 } from 'lucide-react';
import AuthRouter from './components/Auth/AuthRouter';
import GameDashboard from './components/Dashboard/GameDashboard';
import LoadingScreen from './components/Common/LoadingScreen';
import WelcomeToast from './components/Common/WelcomeToast';

export default function App() {
    const [user, setUser] = useState(null);
    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [welcomeMessage, setWelcomeMessage] = useState('');

    // Load user from localStorage on initial render
    useEffect(() => {
        const storedUser = localStorage.getItem('game-catalog-user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    // Load/save games from localStorage based on user
    useEffect(() => {
        if (user) {
            const userIdentifier = user.sub || user.id; // Google uses 'sub', custom uses 'id'
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
                    return { ...rest, imageUrl: '' }; // Remove base64 images before storing
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
    
    const handleSetCurrentUser = (profile) => {
        const firstName = getFirstName(profile);
        setWelcomeMessage(`Bem-vindo(a), ${firstName}!`);
        setUser(profile);
        localStorage.setItem('game-catalog-user', JSON.stringify(profile));
    };

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
            id: `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // More robust ID
            createdAt: new Date().toISOString()
        }));
        setGames(prevGames => [...gamesWithIds, ...prevGames].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    };

    const handleDeleteGame = (gameId) => {
        setGames(games.filter(game => game.id !== gameId));
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            <WelcomeToast message={welcomeMessage} onClear={() => setWelcomeMessage('')} />
            {user ? (
                <GameDashboard
                    user={user}
                    games={games}
                    onSignOut={handleLogout}
                    onSaveGame={handleSaveGame}
                    onDeleteGame={handleDeleteGame}
                    onBulkSave={handleBulkSave}
                />
            ) : (
                <AuthRouter onLoginSuccess={handleSetCurrentUser} />
            )}
        </div>
    );
}
