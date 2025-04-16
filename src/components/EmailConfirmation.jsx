import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const EmailConfirmation = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get('token'); // Extract token from URL
    if (token) {
      verifyEmail(token);
    } else {
      setMessage('Invalid or missing token.');
      setLoading(false);
    }
  }, [searchParams]);

  const verifyEmail = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/auth/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Email verified successfully! Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/login'; // Redirect to login page
        }, 3000);
      } else {
        setMessage(data.message || 'Email verification failed.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {loading ? <p>Verifying your email...</p> : <p>{message}</p>}
    </div>
  );
};

export default EmailConfirmation;