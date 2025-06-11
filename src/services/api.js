const API_URL = import.meta.env.VITE_API_URL || '/api';

const apiService = {
  async request(path, options = {}) {
    const url = `${API_URL}${path}`;

    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Ocorreu um erro inesperado.' }));
        throw new Error(errorData.message || `Erro HTTP! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }
    
    return response;
  },

  get(path, options) {
    return this.request(path, { ...options, method: 'GET' });
  },

  post(path, body, options) {
    return this.request(path, { ...options, method: 'POST', body: JSON.stringify(body) });
  },

  put(path, body, options) {
    return this.request(path, { ...options, method: 'PUT', body: JSON.stringify(body) });
  },

  delete(path, options) {
    return this.request(path, { ...options, method: 'DELETE' });
  },
};

export default apiService;