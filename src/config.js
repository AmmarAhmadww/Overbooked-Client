export const API_URL = 'http://localhost:5001';

export const apiRequest = async (endpoint, options = {}) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (user) {
    defaultHeaders['Authorization'] = `Bearer ${user._id}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'API request failed');
  }

  return response.json();
}; 