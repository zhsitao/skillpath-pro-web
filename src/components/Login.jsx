import React, { useState } from 'react';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateEmail(email)) {
      setError('Invalid email format.');
      setLoading(false);
      return;
    }

    try {
      const response = await login({ email, password });
      console.log('Login response:', response); // Log the response for debugging

      // Check if the login was successful based on the "message" property
      if (response?.message === "Login successful.") {
        localStorage.setItem('token', response.token); // Store JWT token
        console.log('Login successful, redirecting...');
        await new Promise(resolve => setTimeout(resolve, 1400)); // Optional: Add a delay before redirecting
        navigate('/', { replace: true }); // 使用replace以防止返回到登录页
      } else {
        setError(response.message || 'Login failed.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '500px', margin: '50px auto' }}>
        <h2 style={{ textAlign: 'center' }}>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="flex gap-4" style={{ marginTop: '2rem' }}>
            <button type="submit" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
            <button type="button" className="secondary" onClick={() => navigate('/')} style={{ flex: 1 }}>
              Back
            </button>
          </div>
          <p style={{ textAlign: 'center', marginTop: '1rem', color: '#666' }}>
            Don't have an account? <a href="/signup">Sign up here</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
