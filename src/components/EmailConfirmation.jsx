import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { confirmEmail } from '../api/auth';

const EmailConfirmation = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      confirmEmail(token).then((response) => {
        if (response.success) {
          setMessage('Email confirmed! Redirecting to profile setup...');
          setTimeout(() => {
            window.location.href = '/profile-setup';
          }, 3000);
        } else {
          setMessage(response.message || 'Email confirmation failed.');
        }
      });
    }
  }, [searchParams]);

  return <p>{message}</p>;
};

export default EmailConfirmation;