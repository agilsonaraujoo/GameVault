import React from 'react';

const PriceTag = ({ price }) => {
    const priceStr = String(price || '').trim();

    // Não renderiza se o preço for uma string vazia.
    if (!priceStr) return null;

    // Verifica se o preço é um número (com ou sem vírgula/ponto) ou a palavra "Gratuito".
    // Rejeita textos descritivos como "varia de acordo com a edição".
    const isValidPrice = /^(gratuito|free)$/i.test(priceStr) || /^\d+([,.]\d{1,2})?$/.test(priceStr);

    if (!isValidPrice) {
        return null;
    }

    const isFree = /^(gratuito|free)$/i.test(priceStr) || priceStr === '0' || priceStr === '0,00';

    const bgColor = isFree ? 'bg-blue-500' : 'bg-fuchsia-600';
    const displayText = isFree ? 'Gratuito' : `R$ ${priceStr.replace('.', ',')}`;

    return (
        <div className={`absolute top-2 right-2 ${bgColor} text-white text-xs sm:text-sm font-bold px-2 py-1 sm:px-3 rounded-full shadow-lg`}>
            {displayText}
        </div>
    );
};

export default PriceTag;
