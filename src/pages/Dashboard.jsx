import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleSelection from '../components/RoleSelection';
import SkillGapAnalysis from '../components/SkillGapAnalysis';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    // In a real app, you would decode the JWT token to get the user ID
    // For now, we'll use a mock ID
    setUserId(1);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Welcome to Your Dashboard</h1>
      
      {userId && !selectedRole && (
        <RoleSelection userId={userId} onRoleSelect={handleRoleSelect} />
      )}

      {userId && selectedRole && (
        <SkillGapAnalysis userId={userId} />
      )}

      <button
        onClick={handleLogout}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          position: 'absolute',
          top: '20px',
          right: '20px',
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
