const BASE_URL = 'http://localhost:8080';

export const getProfile = async () => {
  try {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (!token) {
      throw new Error('Token is missing. Please log in again.');
    }

    const response = await fetch(`${BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Add the token to the Authorization header
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};