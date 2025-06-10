import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out"
            onClick={onClose} // Close modal on overlay click
        >
            <div 
                className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg relative transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalShow"
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal content
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <button 
                        onClick={onClose} 
                        className="p-1 rounded-full hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
                        aria-label="Fechar modal"
                    >
                        <X size={24} />
                    </button>
                </div>
                {children}
            </div>
            <style jsx global>{`
                @keyframes modalShow {
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-modalShow {
                    animation: modalShow 0.3s forwards;
                }
            `}</style>
        </div>
    );
};

export default Modal;
