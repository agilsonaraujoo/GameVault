import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { getStoredUsers } from '../../utils/authUtils';

const LoginScreen = ({ onLoginSuccess, onSwitchToRegister, onBack }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        const users = getStoredUsers();
        const foundUser = users.find(u => u.email === email);
        
        // --- AVISO DE SEGURANÇA ---
        // NUNCA compare senhas diretamente no lado do cliente em uma aplicação real.
        // Isso é APENAS PARA FINS DE DEMONSTRAÇÃO.
        // As senhas devem ser hasheadas e verificadas em um servidor backend.
        if (foundUser && foundUser.password === password) { // INSEGURO: Comparação direta de senha
            onLoginSuccess(foundUser);
        } else {
            setError('E-mail ou senha inválidos.');
        }
        // --- FIM DO AVISO DE SEGURANÇA ---
    };

    return (
         <div className="w-full max-w-md p-8 bg-gray-800 rounded-2xl shadow-2xl relative">
            <button onClick={onBack} className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors"><ArrowLeft size={24}/></button>
            <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-500 transition-colors">Entrar</button>
            </form>
            <p className="text-center text-sm text-gray-400 mt-6">
                Não tem uma conta? <button onClick={onSwitchToRegister} className="font-medium text-indigo-400 hover:underline">Cadastre-se</button>
            </p>
         </div>
    );
};

export default LoginScreen;
