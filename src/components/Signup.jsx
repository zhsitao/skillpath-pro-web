import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/auth';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // Track if signup is successful
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
        setSuccess(true); // Mark signup as successful
      } else {
        setError(response.message || 'Signup failed.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {!success ? (
        <>
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" style={{ marginTop: '20px' }}>
              Sign Up
            </button>
          </form>
          <button
            onClick={() => navigate('/')}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Back
          </button>
        </>
      ) : (
        <>
          <h2>Signup Successful!</h2>
          <p>You may now log in to your account.</p>
          <button
            onClick={() => navigate('/login')}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Go to Login Page
          </button>
        </>
      )}
    </div>
  );
};

export default Signup;

//Version without back button with just prompts , and no buttons with login .
/*import React, { useState } from 'react';
import { signup } from '../api/auth';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

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
      if (response?.success) {
        setSuccessMessage('Signup successful! Please check your email for confirmation.');
      } else {
        setError(response.message || 'Signup failed.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;
*/
