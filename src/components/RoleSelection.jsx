import React, { useState, useEffect } from 'react';

const RoleSelection = ({ userId, onRoleSelect, onRoleClick }) => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [currentRole, setCurrentRole] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/roles?userId=${userId}`);
      const data = await response.json();
      setRoles(data);
    } catch (err) {
      setError('Failed to load roles');
    }
  };

  const handleRoleSelect = async (e) => {
    const roleId = e.target.value;
    setSelectedRole(roleId);
    
    try {
      const response = await fetch(`http://localhost:8080/api/roles/${roleId}`);
      const role = await response.json();
      setCurrentRole(role);
      if (onRoleClick) {
        onRoleClick(role);
      }
    } catch (err) {
      setError('Failed to load role details');
    }
  };

  const handleConfirm = async () => {
    if (!selectedRole) {
      setError('Please select a role first');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}/roles/${selectedRole}`, {
        method: 'POST',
      });
      
      if (response.ok) {
        onRoleSelect(selectedRole);
      } else {
        setError('Failed to set role');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div style={{ textAlign: 'left', marginTop: '20px' }}>
      <h3>Add New Role</h3>
      <div style={{ marginBottom: '20px' }}>
        <select 
          value={selectedRole} 
          onChange={handleRoleSelect}
          style={{
            padding: '10px',
            fontSize: '16px',
            width: '300px',
            marginRight: '10px'
          }}
        >
          <option value="">Select a role...</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>
              {role.title}
            </option>
          ))}
        </select>
        <button 
          onClick={handleConfirm}
          style={{
            padding: '10px 20px',
            fontSize: '16px'
          }}
        >
          Confirm Selection
        </button>
      </div>

      {currentRole && (
        <div style={{ marginTop: '20px' }}>
          <h3>{currentRole.title}</h3>
          <p>{currentRole.description}</p>
          
          <div style={{ marginTop: '15px' }}>
            <h4>Required Skills</h4>
            {Object.entries(currentRole.requiredSkills).map(([skill, level]) => (
              <div key={skill} style={{ 
                padding: '10px',
                margin: '5px 0',
                backgroundColor: '#f5f5f5',
                borderRadius: '5px'
              }}>
                <strong>{skill}</strong> - Required Level: {level}
                <p><small>{currentRole.skillDescriptions[skill]}</small></p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '15px' }}>
            <h4>Optional Skills</h4>
            {Object.entries(currentRole.optionalSkills).map(([skill, level]) => (
              <div key={skill} style={{ 
                padding: '10px',
                margin: '5px 0',
                backgroundColor: '#e8f4f8',
                borderRadius: '5px'
              }}>
                <strong>{skill}</strong> - Recommended Level: {level}
                <p><small>{currentRole.skillDescriptions[skill]}</small></p>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default RoleSelection;
