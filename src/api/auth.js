export const signup = async (data) => {
  try {
    const response = await fetch('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error('Signup API error:', error);
    return { success: false, message: 'Network error' };
  }
};

export const confirmEmail = async (token) => {
  try {
    const response = await fetch(`/auth/confirm?token=${token}`, {
      method: 'GET',
    });
    return await response.json();
  } catch (error) {
    console.error('Email confirmation API error:', error);
    return { success: false, message: 'Network error' };
  }
};