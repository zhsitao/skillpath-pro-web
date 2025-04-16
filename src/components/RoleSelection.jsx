import React, { useState, useEffect } from 'react';

const RoleSelection = ({ userId, onRoleSelect }) => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/skills/roles');
      const data = await response.json();
      setRoles(data);
    } catch (err) {
      setError('Failed to load roles');
    }
  };

  const handleRoleChange = async (e) => {
    const roleId = e.target.value;
    setSelectedRole(roleId);
    
    try {
      const response = await fetch(`http://localhost:8080/api/skills/user/${userId}/role/${roleId}`, {
        method: 'POST',
      });
      
      if (response.ok) {
        onRoleSelect(roleId);
      } else {
        setError('Failed to set role');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>Select Your Target Role</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <select 
        value={selectedRole} 
        onChange={handleRoleChange}
        style={{
          padding: '10px',
          fontSize: '16px',
          width: '300px',
          marginTop: '10px'
        }}
      >
        <option value="">Select a role...</option>
        {roles.map(role => (
          <option key={role.id} value={role.id}>
            {role.title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RoleSelection;
