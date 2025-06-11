import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const NotificationToast = ({ notification, onClear }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (notification?.message) {
            setShow(true);
            const timer = setTimeout(() => {
                setShow(false);
                setTimeout(onClear, 500); // Aguarda a animação de saída antes de limpar
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [notification, onClear]);

    if (!notification?.message) return null;

    const { message, type = 'success' } = notification;

    const toastStyles = {
        success: 'bg-green-600',
        error: 'bg-red-600',
    };

    const toastIcons = {
        success: <CheckCircle2 size={24} />,
        error: <XCircle size={24} />,
    };

    const bgColor = toastStyles[type] || toastStyles.success;
    const icon = toastIcons[type] || toastIcons.success;

    return (
        <div className={`fixed top-5 right-5 ${bgColor} text-white py-3 px-6 rounded-lg shadow-lg z-50 flex items-center gap-3 transition-all duration-500 transform ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            {icon}
            <span>{message}</span>
        </div>
    );
};

export default NotificationToast;
