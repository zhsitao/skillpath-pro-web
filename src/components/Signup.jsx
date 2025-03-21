import React, { useState } from 'react';
import { signup } from '../api/auth';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Invalid email format.');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must contain at least 8 characters, including one uppercase letter and one number.');
      return;
    }
    try {
      const response = await signup({ email, password });
      if (response.success) {
        alert('Signup successful! Please check your email for confirmation.');
      } else {
        setError(response.message || 'Signup failed.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;