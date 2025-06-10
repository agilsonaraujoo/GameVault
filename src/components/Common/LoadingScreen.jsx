import React from 'react';
import { Gamepad2 } from 'lucide-react';

const LoadingScreen = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
            <Gamepad2 className="w-16 h-16 mx-auto animate-spin text-indigo-500" />
            <p className="mt-4 text-xl font-semibold">A carregar o seu Catálogo...</p>
        </div>
    </div>
);

export default LoadingScreen;
