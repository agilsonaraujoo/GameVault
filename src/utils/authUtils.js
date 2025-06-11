// --- AVISO DE SEGURANÇA ---
// As funções abaixo simulam o gerenciamento de usuários no localStorage.
// Isto é APENAS PARA FINS DE DEMONSTRAÇÃO e NÃO É SEGURO.
// Em uma aplicação real, nunca armazene senhas, mesmo que com hash, no lado do cliente.
// A autenticação de usuários e o gerenciamento de senhas DEVEM ser tratados por um servidor backend seguro.

export const getStoredUsers = () => {
    const users = localStorage.getItem('game-catalog-all-users');
    return users ? JSON.parse(users) : [];
};

export const storeUsers = (users) => {
    localStorage.setItem('game-catalog-all-users', JSON.stringify(users));
};
// --- FIM DO AVISO DE SEGURANÇA ---

// Função auxiliar para decodificar tokens JWT do Google
export function decodeJwtResponse(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Error decoding JWT", e);
        return null;
    }
}
