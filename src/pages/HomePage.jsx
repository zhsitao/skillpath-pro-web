import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to SkillPath Pro</h1>
      <p>Please choose an option:</p>
      <div>
        <button
          onClick={() => navigate('/signup')}
          style={{
            margin: '10px',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Sign Up
        </button>
        <button
          onClick={() => navigate('/login')}
          style={{
            margin: '10px',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default HomePage;