import React, { useState, useEffect } from 'react';

const WelcomeToast = ({ message, onClear }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (message) {
            setShow(true);
            const timer = setTimeout(() => {
                setShow(false);
                setTimeout(onClear, 500); 
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [message, onClear]);

    return (
        <div className={`fixed top-5 right-5 bg-green-600 text-white py-3 px-6 rounded-lg shadow-lg z-50 transition-all duration-500 transform ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            {message}
        </div>
    );
};

export default WelcomeToast;
