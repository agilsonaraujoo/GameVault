import React from 'react';

const PriceTag = ({ price }) => {
    if (price === null || price === undefined || price === '') return null;

    const normalizedPrice = String(price).trim().toLowerCase();
    const isFree = normalizedPrice === 'gratuito' || normalizedPrice === 'free' || normalizedPrice === '0' || normalizedPrice === '0,00';
    
    const bgColor = isFree ? 'bg-blue-500' : 'bg-green-500';
    const displayText = isFree ? 'Gratuito' : (typeof price === 'number' ? `R$ ${price.toFixed(2).replace('.', ',')}` : `R$ ${price}`);

    return (
        <div className={`absolute top-2 right-2 ${bgColor} text-white text-xs sm:text-sm font-bold px-2 py-1 sm:px-3 rounded-full shadow-lg`}>
            {displayText}
        </div>
    );
};

export default PriceTag;
