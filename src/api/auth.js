const BASE_URL = 'http://localhost:8080';

export const signup = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Signup request failed.');
    }

    return await response.json();
  } catch (error) {
    console.error('Signup API error:', error);
    return { success: false, message: error.message || 'Network error' };
  }
};

export const login = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Login request failed.');
    }

    return await response.json(); // Ensure the response is parsed as JSON
  } catch (error) {
    console.error('Login API error:', error);
    return { success: false, message: error.message || 'Network error' };
  }
};

export const confirmEmail = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/confirm?token=${token}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Email confirmation request failed.');
    }

    return await response.json();
  } catch (error) {
    console.error('Email confirmation API error:', error);
    return { success: false, message: error.message || 'Network error' };
  }
};
