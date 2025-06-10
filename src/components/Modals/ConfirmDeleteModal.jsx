import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, gameName }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Exclusão">
            <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                    <AlertTriangle className="w-12 h-12 text-red-500 flex-shrink-0" />
                    <div>
                        <p className="text-lg text-white">
                            Tem certeza que deseja excluir o jogo 
                            <strong className="text-red-400"> {gameName || "selecionado"}</strong>?
                        </p>
                        <p className="text-sm text-gray-400">Esta ação não poderá ser desfeita.</p>
                    </div>
                </div>
            </div>
            <div className="bg-gray-700/50 px-6 py-3 flex justify-end gap-3 border-t border-gray-700">
                <button 
                    type="button" 
                    onClick={onClose} 
                    className="px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-500 transition-colors"
                >
                    Cancelar
                </button>
                <button 
                    type="button" 
                    onClick={onConfirm} 
                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-500 transition-colors"
                >
                    Excluir
                </button>
            </div>
        </Modal>
    );
};

export default ConfirmDeleteModal;
