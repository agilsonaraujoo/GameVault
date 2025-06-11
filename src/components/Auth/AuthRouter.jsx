import React, { useState } from 'react';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import AuthScreen from './AuthScreen';
import { decodeJwtResponse } from '../../utils/authUtils';

const AuthRouter = ({ onLoginSuccess, onGoogleLogin }) => {
    const [view, setView] = useState('initial'); 

    

    const renderView = () => {
        switch (view) {
            case 'login':
                return <LoginScreen onLoginSuccess={onLoginSuccess} onSwitchToRegister={() => setView('register')} onBack={() => setView('initial')} />;
            case 'register':
                return <RegisterScreen onRegisterSuccess={onLoginSuccess} onSwitchToLogin={() => setView('login')} onBack={() => setView('initial')} />;
            default:
                return <AuthScreen onGoogleLoginSuccess={onGoogleLogin} onEmailLoginClick={() => setView('login')} />;
        }
    };

    return (
         <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-900 to-indigo-900">
            {renderView()}
        </div>
    )
}

export default AuthRouter;
