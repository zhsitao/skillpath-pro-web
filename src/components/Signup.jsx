import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/auth';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateEmail(email)) {
      setError('Invalid email format.');
      return;
    }
    if (!validatePassword(password)) {
      setError(
        'Password must contain at least 8 characters, including one uppercase letter and one number.'
      );
      return;
    }

    try {
      const response = await signup({ email, password });
      if (response?.success) {
        setSuccess(true);
        // 在2秒后自动跳转到登录页面
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      } else {
        setError(response.message || 'Signup failed.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '500px', margin: '50px auto' }}>
        {!success ? (
          <>
            <h2 style={{ textAlign: 'center' }}>Create Your Account</h2>
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
                <small style={{ display: 'block', color: '#666', marginTop: '0.5rem' }}>
                  Must be at least 8 characters with one uppercase letter and one number
                </small>
              </div>
              {error && <p className="error-message">{error}</p>}
              <div className="flex gap-4" style={{ marginTop: '2rem' }}>
                <button type="submit" style={{ flex: 1 }}>Sign Up</button>
                <button type="button" className="secondary" onClick={() => navigate('/')} style={{ flex: 1 }}>
                  Back
                </button>
              </div>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <h2>Signup Successful!</h2>
            <p style={{ marginBottom: '2rem' }}>You may now log in to your account.</p>
            <button onClick={() => navigate('/login')}>
              Go to Login Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
