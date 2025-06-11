import React from 'react';
import { Gamepad2 } from 'lucide-react';

const AuthScreen = ({ onEmailLoginClick }) => {

    return (
        <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-2xl text-center">
            <Gamepad2 className="w-20 h-20 mx-auto text-indigo-400" />
            <h1 className="text-4xl font-bold tracking-tight">GameVault</h1>
            <p className="text-gray-400">O seu catálogo de jogos pessoal. <br/> Escolha como quer entrar.</p>
            <div className="flex flex-col items-center gap-4">
                 <button 
                    onClick={onEmailLoginClick}
                    className="w-full max-w-[320px] bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-500 transition-colors duration-300"
                >
                    Entrar com E-mail e Senha
                </button>

            </div>
        </div>
    );
};

export default AuthScreen;
