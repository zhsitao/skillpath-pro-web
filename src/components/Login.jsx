import React, { useState, useEffect } from 'react';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 检查是否已登录，如果已登录直接跳转到dashboard
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

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
      console.log('Login response:', response);

      if (response?.token && response?.userId) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId);
        navigate('/dashboard', { replace: true });
      } else {
        setError(response.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
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
