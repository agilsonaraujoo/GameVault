import React, { useEffect } from 'react';
import { Gamepad2 } from 'lucide-react';
import { GOOGLE_CLIENT_ID } from '../../constants/googleConstants';

const AuthScreen = ({ onGoogleLoginSuccess, onEmailLoginClick }) => {
    useEffect(() => {
        if (window.google?.accounts?.id) { // Check if GSI library is already loaded and initialized
             window.google.accounts.id.renderButton(
                document.getElementById("google-signin-button"),
                { theme: "outline", size: "large", type: "standard", text: "continue_with", width: "320", logo_alignment: "left"}
            );
            return; // Skip script injection if already available
        }

        // If not loaded, create and append the script
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
            if (window.google && window.google.accounts && window.google.accounts.id) {
                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: onGoogleLoginSuccess
                });
                window.google.accounts.id.renderButton(
                    document.getElementById("google-signin-button"),
                    { theme: "outline", size: "large", type: "standard", text: "continue_with", width: "320", logo_alignment: "left"}
                );
            } else {
                console.error('Google Sign-In library failed to load.');
            }
        };
        script.onerror = () => {
            console.error('Error loading Google Sign-In script.');
        };
        document.body.appendChild(script);

        // Cleanup function to remove the script if the component unmounts
        return () => {
            const scriptElement = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
            if (scriptElement) {
                document.body.removeChild(scriptElement);
            }
        };
    }, [onGoogleLoginSuccess]);

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
                <div id="google-signin-button" className="flex justify-center"></div>
            </div>
        </div>
    );
};

export default AuthScreen;
