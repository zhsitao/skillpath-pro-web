import React, { useState, useEffect } from 'react';

const RoleSelection = ({ userId, onRoleSelect, onRoleClick }) => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [currentRole, setCurrentRole] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userId) {
      fetchRoles();
    }
  }, [userId]);

  const fetchRoles = async () => {
    try {
      const response = await fetch(`http://104.197.224.247:8080/api/roles?userId=${userId}`);
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
      const response = await fetch(`http://104.197.224.247:8080/api/roles/${roleId}`);
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
      const response = await fetch(`http://104.197.224.247:8080/api/users/${userId}/roles/${selectedRole}`, {
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
    <div style={{ padding: '1rem' }}>
      <div className="flex flex-between flex-center" style={{ marginBottom: '2rem' }}>
        <h3 style={{ margin: 0 }}>Add New Role</h3>
        <div className="flex gap-4">
          <select 
            value={selectedRole} 
            onChange={handleRoleSelect}
            style={{ margin: 0, minWidth: '250px' }}
          >
            <option value="">Select a role...</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>
                {role.title}
              </option>
            ))}
          </select>
          <button onClick={handleConfirm} disabled={!selectedRole}>
            Add Role
          </button>
        </div>
      </div>

      {currentRole && (
        <div>
          <h3>{currentRole.title}</h3>
          <p style={{ color: '#666', marginBottom: '2rem' }}>{currentRole.description}</p>
          
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ marginTop: 0 }}>Required Skills</h4>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {Object.entries(currentRole.requiredSkills).map(([skill, level]) => (
                <div key={skill} style={{ 
                  padding: '1rem',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '8px',
                  border: '1px solid #e0f2fe'
                }}>
                  <div className="flex flex-between" style={{ flexDirection: 'column' }}>
                    <strong>{skill}</strong>
                    <span style={{ 
                      color: '#0369a1', 
                      fontSize: '0.9em',
                      marginTop: '0.5rem'
                    }}>
                      Required Level: {level}
                    </span>
                  </div>
                  <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9em' }}>
                    {currentRole.skillDescriptions[skill]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h4 style={{ marginTop: 0 }}>Optional Skills</h4>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {Object.entries(currentRole.optionalSkills).map(([skill, level]) => (
                <div key={skill} style={{ 
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div className="flex flex-between" style={{ flexDirection: 'column' }}>
                    <strong>{skill}</strong>
                    <span style={{ 
                      color: '#64748b',
                      fontSize: '0.9em',
                      marginTop: '0.5rem'
                    }}>
                      Recommended Level: {level}
                    </span>
                  </div>
                  <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9em' }}>
                    {currentRole.skillDescriptions[skill]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default RoleSelection;
