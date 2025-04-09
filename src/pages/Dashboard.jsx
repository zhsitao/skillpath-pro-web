import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the JWT token
    console.log('User logged out.');
    navigate('/'); // Redirect to homepage
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to Your Dashboard</h1>
      <p>This is your personalized dashboard.</p>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        Logout
      </button>

      {/* Customize Profile Button */}
      <button
        onClick={() => navigate('/profile')}
        style={{
          marginTop: '20px',
          marginLeft: '10px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        Customize Profile
      </button>
    </div>
  );
};

export default Dashboard;