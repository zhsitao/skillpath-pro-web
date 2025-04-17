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

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || 'Login request failed.');
    }

    if (!responseData.token || !responseData.userId) {
      throw new Error('Invalid response from server');
    }

    return responseData;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
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
