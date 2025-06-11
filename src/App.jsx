import React, { useState, useEffect, useCallback } from 'react';
import { Gamepad2 } from 'lucide-react';
import { auth, db } from './firebase'; // Importa auth e db do Firebase
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, onSnapshot, addDoc, doc, updateDoc, deleteDoc, writeBatch, orderBy } from 'firebase/firestore';
import AuthRouter from './components/Auth/AuthRouter';
import GameDashboard from './components/Dashboard/GameDashboard';
import LoadingScreen from './components/Common/LoadingScreen';
import NotificationToast from './components/Common/NotificationToast';

export default function App() {
    const [user, setUser] = useState(null);
    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
        const [notification, setNotification] = useState({ message: '', type: 'success' });
    const [selectedGames, setSelectedGames] = useState(new Set());
    const [isSelectionMode, setSelectionMode] = useState(false);

    // Gerencia o estado de autenticação do usuário com o Firebase em tempo real
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // Usuário está logado. Normaliza o objeto do usuário.
                setUser({
                    uid: firebaseUser.uid,
                    name: firebaseUser.displayName,
                    email: firebaseUser.email,
                    picture: firebaseUser.photoURL,
                });
            } else {
                // Usuário está deslogado.
                setUser(null);
            }
            setIsLoading(false);
        });
        // Limpa o listener quando o componente é desmontado
        return () => unsubscribe();
    }, []);

    // Carrega os jogos do Firestore em tempo real
    useEffect(() => {
        if (user && user.uid) {
            const gamesCollectionRef = collection(db, 'users', user.uid, 'games');
            const q = query(gamesCollectionRef, orderBy('createdAt', 'desc'));

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const gamesData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setGames(gamesData);
            }, (error) => {
                console.error("Erro ao buscar jogos do Firestore:", error);
                setNotification({ message: 'Não foi possível carregar os jogos.', type: 'error' });
            });

            // Limpa o listener ao desmontar o componente ou ao trocar de usuário
            return () => unsubscribe();
        } else {
            setGames([]); // Limpa os jogos se o usuário fizer logout
        }
    }, [user]);

    // Função chamada após o sucesso do login/registro para dar feedback
    const handleLoginSuccess = useCallback((firebaseUser) => {
        if (!firebaseUser || !firebaseUser.displayName) return;
        const firstName = firebaseUser.displayName.split(' ')[0];
        setNotification({ message: `Bem-vindo(a), ${firstName}!`, type: 'success' });
    }, []);

    // Função para deslogar o usuário usando o Firebase
    const handleLogout = async () => {
        try {
            await signOut(auth);
            setNotification({ message: 'Você foi desconectado.', type: 'info' });
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            setNotification({ message: 'Erro ao desconectar.', type: 'error' });
        }
    };

    const handleSaveGame = async (gameToSave) => {
        if (!user) return;
        try {
            if (gameToSave.id) {
                // Atualiza um jogo existente
                const gameDocRef = doc(db, 'users', user.uid, 'games', gameToSave.id);
                await updateDoc(gameDocRef, gameToSave);
                setNotification({ message: 'Jogo atualizado!', type: 'success' });
            } else {
                // Adiciona um novo jogo
                const gamesCollectionRef = collection(db, 'users', user.uid, 'games');
                await addDoc(gamesCollectionRef, { ...gameToSave, createdAt: new Date().toISOString() });
                setNotification({ message: 'Jogo salvo!', type: 'success' });
            }
        } catch (error) {
            console.error("Erro ao salvar jogo:", error);
            setNotification({ message: 'Falha ao salvar o jogo.', type: 'error' });
        }
    };

    const handleBulkSave = async (newGames) => {
        if (!user) return;
        const batch = writeBatch(db);
        const gamesCollectionRef = collection(db, 'users', user.uid, 'games');
        newGames.forEach(game => {
            const newDocRef = doc(gamesCollectionRef); // Cria uma referência com ID automático
            batch.set(newDocRef, { ...game, createdAt: new Date().toISOString() });
        });
        try {
            await batch.commit();
            setNotification({ message: `${newGames.length} jogos importados!`, type: 'success' });
        } catch (error) {
            console.error("Erro ao importar jogos em massa:", error);
            setNotification({ message: 'Falha ao importar os jogos.', type: 'error' });
        }
    };

    const handleDeleteGame = async (gameId) => {
        if (!user) return;
        try {
            const gameDocRef = doc(db, 'users', user.uid, 'games', gameId);
            await deleteDoc(gameDocRef);
            setNotification({ message: 'Jogo excluído.', type: 'info' });
        } catch (error) {
            console.error("Erro ao excluir jogo:", error);
            setNotification({ message: 'Falha ao excluir o jogo.', type: 'error' });
        }
    };

    const deleteSelectedGames = async () => {
        if (!user || selectedGames.size === 0) return;
        const batch = writeBatch(db);
        selectedGames.forEach(gameId => {
            const gameDocRef = doc(db, 'users', user.uid, 'games', gameId);
            batch.delete(gameDocRef);
        });
        try {
            await batch.commit();
            setNotification({ message: `${selectedGames.size} jogos excluídos.`, type: 'info' });
            setSelectedGames(new Set());
            setSelectionMode(false);
        } catch (error) {
            console.error("Erro ao excluir jogos selecionados:", error);
            setNotification({ message: 'Falha ao excluir os jogos.', type: 'error' });
        }
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
                <AuthRouter onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
}
