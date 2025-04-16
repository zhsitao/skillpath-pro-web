import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '100px auto', textAlign: 'center' }}>
        <h1>Welcome to SkillPath Pro</h1>
        <p style={{ fontSize: '1.1em', color: '#666', marginBottom: '2rem' }}>
          Start your professional development journey today with personalized learning paths and skill tracking.
        </p>
        <div className="flex gap-4" style={{ justifyContent: 'center' }}>
          <button onClick={() => navigate('/signup')}>
            Sign Up
          </button>
          <button className="secondary" onClick={() => navigate('/login')}>
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
