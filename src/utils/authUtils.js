// --- SECURITY WARNING ---
// The functions below simulate user management in localStorage.
// This is for DEMONSTRATION PURPOSES ONLY and is NOT SECURE.
// In a real application, never store passwords, even hashed, on the client-side.
// User authentication and password management MUST be handled by a secure backend server.

export const getStoredUsers = () => {
    const users = localStorage.getItem('game-catalog-all-users');
    return users ? JSON.parse(users) : [];
};

export const storeUsers = (users) => {
    localStorage.setItem('game-catalog-all-users', JSON.stringify(users));
};
// --- END SECURITY WARNING ---

// Helper to decode JWT tokens from Google
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
