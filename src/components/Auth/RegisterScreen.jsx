import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { auth } from '../../firebase'; // Importa a instância do auth
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"; // Importa as funções de autenticação

const RegisterScreen = ({ onRegisterSuccess, onSwitchToLogin, onBack }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const getFirstName = (fullName) => (fullName || '').split(' ')[0];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Cria o usuário com e-mail e senha no Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Adiciona o nome ao perfil do usuário no Firebase
            await updateProfile(user, {
                displayName: name,
                photoURL: `https://placehold.co/40x40/7c3aed/ffffff?text=${name.charAt(0).toUpperCase()}`
            });

            // Chama a função de sucesso passando o usuário do Firebase
            // O App.jsx agora receberá o objeto de usuário do Firebase
            onRegisterSuccess(user);

        } catch (error) {
            console.error("Erro no registro com Firebase:", error);
            // Mapeia os erros do Firebase para mensagens amigáveis
            if (error.code === 'auth/email-already-in-use') {
                setError('Este e-mail já está em uso.');
            } else if (error.code === 'auth/weak-password') {
                setError('A senha deve ter pelo menos 6 caracteres.');
            } else {
                setError('Ocorreu um erro ao criar a conta.');
            }
        }
    };

    return (
        <div className="w-full max-w-md p-8 bg-gray-800 rounded-2xl shadow-2xl relative">
            <button onClick={onBack} className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors"><ArrowLeft size={24}/></button>
            <h2 className="text-3xl font-bold text-center mb-2">Criar Conta</h2>
            {name && <p className="text-center text-lg text-indigo-300 mb-4">Olá, {getFirstName(name)}!</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
                 <input type="text" placeholder="Nome completo" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-500 transition-colors">Cadastrar</button>
            </form>
             <p className="text-center text-sm text-gray-400 mt-6">
                Já tem uma conta? <button onClick={onSwitchToLogin} className="font-medium text-indigo-400 hover:underline">Faça login</button>
            </p>
        </div>
    );
};

export default RegisterScreen;
