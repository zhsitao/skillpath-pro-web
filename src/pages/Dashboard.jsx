import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleSelection from '../components/RoleSelection';
import SkillGapAnalysis from '../components/SkillGapAnalysis';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [showRoleSelection, setShowRoleSelection] = useState(true);

  useEffect(() => {
    // In a real app, you would decode the JWT token to get the user ID
    setUserId(1);
  }, []);

  useEffect(() => {
    if (userId === null) return;
    fetchUserRoles();
  }, [userId]);

  const fetchUserRoles = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}/roles`);
      if (response.ok) {
        const roles = await response.json();
        setUserRoles(roles);
        if (roles.length > 0 && !selectedRoleId) {
          setSelectedRoleId(roles[0].id);
          setShowRoleSelection(false);
        }
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch user roles:', err);
      setIsLoading(false);
    }
  };

  const handleRoleSelect = async (roleId) => {
    setSelectedRoleId(roleId);
    setShowRoleSelection(false);
    await fetchUserRoles();
  };

  const handleAddNewRole = () => {
    setShowRoleSelection(true);
  };

  const handleRoleChange = (roleId) => {
    setSelectedRoleId(roleId);
    setShowRoleSelection(false);
  };

  const handleRoleClick = (role) => {
    if (!showRoleSelection) {
      setSelectedRoleId(role.id);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1>Your Skill Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      {/* Role Tabs */}
      {userRoles.length > 0 && (
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '20px',
          overflowX: 'auto',
          padding: '10px 0'
        }}>
          {userRoles.map(role => (
            <button
              key={role.id}
              onClick={() => handleRoleChange(role.id)}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                cursor: 'pointer',
                backgroundColor: selectedRoleId === role.id ? '#4CAF50' : '#f0f0f0',
                color: selectedRoleId === role.id ? 'white' : 'black',
                border: 'none',
                borderRadius: '20px',
                minWidth: '150px'
              }}
            >
              <div>{role.title}</div>
            </button>
          ))}
          <button
            onClick={handleAddNewRole}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              cursor: 'pointer',
              backgroundColor: '#e0e0e0',
              border: 'none',
              borderRadius: '20px'
            }}
          >
            + Add New Role
          </button>
        </div>
      )}
      
      {showRoleSelection ? (
        userId && <RoleSelection 
          userId={userId} 
          onRoleSelect={handleRoleSelect}
          onRoleClick={handleRoleClick}
        />
      ) : (
        userId && selectedRoleId && <SkillGapAnalysis userId={userId} roleId={selectedRoleId} />
      )}
    </div>
  );
};

export default Dashboard;
