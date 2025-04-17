import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SkillGapAnalysis = ({ userId, roleId }) => {
  const [analysis, setAnalysis] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [proficiency, setProficiency] = useState('BEGINNER');
  const [userSkills, setUserSkills] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    fetchGapAnalysis();
    fetchUserSkills();
  }, [userId, roleId]);

  const fetchGapAnalysis = async () => {
    try {
      const response = await fetch(`http://104.197.224.247:8080/api/users/${userId}/roles/${roleId}/gap-analysis`);
      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError('Failed to load gap analysis');
    }
  };

  const fetchUserSkills = async () => {
    try {
      const response = await fetch(`http://104.197.224.247:8080/api/users/${userId}/skills`);
      const data = await response.json();
      setUserSkills(data);
    } catch (err) {
      setError('Failed to load user skills');
    }
  };

  const handleAddSkill = async () => {
    if (!selectedSkill) return;

    const newSkill = { name: selectedSkill, proficiency };
    const updatedSkills = [...userSkills];
    const existingIndex = updatedSkills.findIndex(s => s.skillName === selectedSkill);
    
    if (existingIndex >= 0) {
      updatedSkills[existingIndex].proficiency = proficiency;
    } else {
      updatedSkills.push({
        skillName: selectedSkill,
        proficiency: proficiency,
        user: { userId }
      });
    }

    try {
      const skillsToUpdate = updatedSkills.map(skill => ({
        name: skill.skillName,
        proficiency: skill.proficiency
      }));

      const response = await fetch(`http://104.197.224.247:8080/api/users/${userId}/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(skillsToUpdate),
      });

      if (response.ok) {
        setSelectedSkill('');
        setProficiency('BEGINNER');
        await fetchUserSkills();
        await fetchGapAnalysis();
      }
    } catch (err) {
      setError('Failed to add skill');
    }
  };

  const handleDeleteSkill = async (skillName) => {
    const updatedSkills = userSkills.filter(skill => skill.skillName !== skillName);
    
    try {
      const skillsToUpdate = updatedSkills.map(skill => ({
        name: skill.skillName,
        proficiency: skill.proficiency
      }));

      const response = await fetch(`http://104.197.224.247:8080/api/users/${userId}/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(skillsToUpdate),
      });

      if (response.ok) {
        await fetchUserSkills();
        await fetchGapAnalysis();
      }
    } catch (err) {
      setError('Failed to delete skill');
    }
  };

  const handleUpdateProficiency = async (skillName, newProficiency) => {
    const updatedSkills = userSkills.map(skill => 
      skill.skillName === skillName 
        ? { ...skill, proficiency: newProficiency }
        : skill
    );

    try {
      const skillsToUpdate = updatedSkills.map(skill => ({
        name: skill.skillName,
        proficiency: skill.proficiency
      }));

      const response = await fetch(`http://104.197.224.247:8080/api/users/${userId}/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(skillsToUpdate),
      });

      if (response.ok) {
        await fetchUserSkills();
        await fetchGapAnalysis();
      }
    } catch (err) {
      setError('Failed to update skill');
    }
  };

  const getSkillColor = (skill) => {
    if (!skill.currentLevel && skill.requiredLevel) return '#fee2e2'; // Missing required - light red
    if (!skill.currentLevel) return '#f3f4f6'; // Missing optional - light grey
    
    const userLevel = skill.currentLevel;
    const requiredLevel = skill.requiredLevel || skill.recommendedLevel;
    
    if (!requiredLevel) return '#fff3e0'; // Other skills - light orange
    
    const levels = { 'BEGINNER': 1, 'INTERMEDIATE': 2, 'ADVANCED': 3 };
    const userValue = levels[userLevel] || 0;
    const requiredValue = levels[requiredLevel] || 0;
    
    if (userValue >= requiredValue) return '#ecfdf5'; // Met or exceeded - light green
    return '#fff7ed'; // Partial - light orange
  };

  if (!analysis) return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h3>Loading...</h3>
    </div>
  );

  return (
    <div style={{ padding: '1rem' }}>
      {/* Progress Bar */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="flex flex-between flex-center">
          <h3 style={{ margin: 0 }}>Overall Progress</h3>
          <span style={{ fontSize: '1.5em', fontWeight: 500, color: '#0a66c2' }}>
            {analysis.progress}%
          </span>
        </div>
        <div style={{ 
          marginTop: '1rem',
          backgroundColor: '#f3f4f6', 
          borderRadius: '1rem',
          height: '1rem',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${analysis.progress}%`,
            height: '100%',
            backgroundColor: '#0a66c2',
            transition: 'width 0.5s ease-in-out'
          }} />
        </div>
      </div>

      {/* Add New Skill */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginTop: 0 }}>Add New Skill</h3>
        <div className="flex gap-4">
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            style={{ margin: 0 }}
          >
            <option value="">Select a skill...</option>
            {analysis.missingRequired.map(skill => (
              <option key={skill.name} value={skill.name}>
                {skill.name} (Required - {skill.requiredLevel})
              </option>
            ))}
            {analysis.missingOptional.map(skill => (
              <option key={skill.name} value={skill.name}>
                {skill.name} (Optional - {skill.recommendedLevel})
              </option>
            ))}
          </select>
          <select 
            value={proficiency}
            onChange={(e) => setProficiency(e.target.value)}
            style={{ margin: 0, width: 'auto' }}
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
          <button onClick={handleAddSkill} disabled={!selectedSkill}>
            Add Skill
          </button>
        </div>
      </div>

      {/* Required Skills */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginTop: 0 }}>Required Skills</h3>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
          {analysis.completedSkills.concat(analysis.partialSkills, analysis.missingRequired)
            .filter(skill => skill.requiredLevel)
            .map(skill => (
              <div key={skill.name} style={{
                padding: '1rem',
                backgroundColor: getSkillColor(skill),
                borderRadius: '8px',
              }}>
                <div className="flex flex-between flex-center">
                  <div>
                    <strong>{skill.name}</strong>
                    <p style={{ margin: '0.5rem 0', fontSize: '0.9em', color: '#666' }}>
                      Required Level: {skill.requiredLevel}
                      {skill.currentLevel && ` - Current Level: ${skill.currentLevel}`}
                    </p>
                    <p style={{ margin: '0.5rem 0', fontSize: '0.8em', color: '#666' }}>
                      {skill.description}
                    </p>
                  </div>
                  {skill.currentLevel ? (
                    <div className="flex gap-4">
                      <select
                        value={skill.currentLevel}
                        onChange={(e) => handleUpdateProficiency(skill.name, e.target.value)}
                        style={{ margin: 0, width: 'auto' }}
                      >
                        <option value="BEGINNER">Beginner</option>
                        <option value="INTERMEDIATE">Intermediate</option>
                        <option value="ADVANCED">Advanced</option>
                      </select>
                      <button className="secondary" onClick={() => handleDeleteSkill(skill.name)}>
                        Remove
                      </button>
                    </div>
                  ) : (
                    <span style={{ color: '#dc2626', fontSize: '0.9em' }}>Missing</span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Optional Skills */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginTop: 0 }}>Optional Skills</h3>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
          {analysis.completedSkills.concat(analysis.missingOptional)
            .filter(skill => skill.recommendedLevel)
            .map(skill => (
              <div key={skill.name} style={{
                padding: '1rem',
                backgroundColor: getSkillColor(skill),
                borderRadius: '8px',
              }}>
                <div className="flex flex-between flex-center">
                  <div>
                    <strong>{skill.name}</strong>
                    <p style={{ margin: '0.5rem 0', fontSize: '0.9em', color: '#666' }}>
                      Recommended Level: {skill.recommendedLevel}
                      {skill.currentLevel && ` - Current Level: ${skill.currentLevel}`}
                    </p>
                    <p style={{ margin: '0.5rem 0', fontSize: '0.8em', color: '#666' }}>
                      {skill.description}
                    </p>
                  </div>
                  {skill.currentLevel ? (
                    <div className="flex gap-4">
                      <select
                        value={skill.currentLevel}
                        onChange={(e) => handleUpdateProficiency(skill.name, e.target.value)}
                        style={{ margin: 0, width: 'auto' }}
                      >
                        <option value="BEGINNER">Beginner</option>
                        <option value="INTERMEDIATE">Intermediate</option>
                        <option value="ADVANCED">Advanced</option>
                      </select>
                      <button className="secondary" onClick={() => handleDeleteSkill(skill.name)}>
                        Remove
                      </button>
                    </div>
                  ) : (
                    <span style={{ color: '#666' }}>Not Started</span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Other Skills */}
      {analysis.otherSkills.length > 0 && (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Other Skills</h3>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
            {analysis.otherSkills.map(skill => (
              <div key={skill.name} style={{
                padding: '1rem',
                backgroundColor: getSkillColor(skill),
                borderRadius: '8px',
              }}>
                <div className="flex flex-between flex-center">
                  <div>
                    <strong>{skill.name}</strong>
                    <p style={{ margin: '0.5rem 0', fontSize: '0.9em', color: '#666' }}>
                      Current Level: {skill.currentLevel}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <select
                      value={skill.currentLevel}
                      onChange={(e) => handleUpdateProficiency(skill.name, e.target.value)}
                      style={{ margin: 0, width: 'auto' }}
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                    </select>
                    <button className="secondary" onClick={() => handleDeleteSkill(skill.name)}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default SkillGapAnalysis;
