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
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      navigate('/login');
      return;
    }
    setUserId(parseInt(storedUserId));
  }, [navigate]);

  useEffect(() => {
    if (userId === null) return;
    fetchUserRoles();
  }, [userId]);

  const fetchUserRoles = async () => {
    try {
      const response = await fetch(`http://104.197.224.247:8080/api/users/${userId}/roles`);
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

  const handleLogout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Optional: Add a delay before redirecting
    navigate('/login', { replace: true }); // 使用replace以防止返回到dashboard
  };

  if (isLoading) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '100px' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="flex flex-between flex-center" style={{ marginBottom: '2rem' }}>
        <h1>Your Skill Dashboard</h1>
        <div className="flex gap-4">
          <button onClick={() => navigate('/learning')}>
            Learning Resources
          </button>
          <button className="secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Role Tabs */}
      {userRoles.length > 0 && (
        <div className="card" style={{ marginBottom: '2rem', padding: '1rem' }}>
          <div style={{ 
            display: 'flex', 
            gap: '1rem',
            overflowX: 'auto',
            padding: '0.5rem'
          }}>
            {userRoles.map(role => (
              <button
                key={role.id}
                onClick={() => handleRoleChange(role.id)}
                className={selectedRoleId === role.id ? '' : 'secondary'}
                style={{
                  minWidth: '150px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.8rem 1.5rem',
                  borderRadius: '2rem'
                }}
              >
                {role.title}
              </button>
            ))}
            <button
              onClick={handleAddNewRole}
              className="secondary"
              style={{
                minWidth: '150px',
                borderRadius: '2rem',
                borderStyle: 'dashed'
              }}
            >
              + Add New Role
            </button>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="card">
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
    </div>
  );
};

export default Dashboard;
