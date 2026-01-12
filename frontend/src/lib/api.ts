// API configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiClient = {
  async post(endpoint: string, data: any) {
    return fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  async get(endpoint: string) {
    return fetch(`${API_URL}${endpoint}`);
  },
};

export { API_URL };

