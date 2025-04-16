import React, { useState, useEffect } from 'react';

const SkillGapAnalysis = ({ userId, roleId }) => {
  const [analysis, setAnalysis] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [proficiency, setProficiency] = useState('BEGINNER');
  const [userSkills, setUserSkills] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGapAnalysis();
    fetchUserSkills();
  }, [userId, roleId]);

  const fetchGapAnalysis = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}/roles/${roleId}/gap-analysis`);
      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError('Failed to load gap analysis');
    }
  };

  const fetchUserSkills = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}/skills`);
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

      const response = await fetch(`http://localhost:8080/api/users/${userId}/skills`, {
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

      const response = await fetch(`http://localhost:8080/api/users/${userId}/skills`, {
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

      const response = await fetch(`http://localhost:8080/api/users/${userId}/skills`, {
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
    if (!skill.currentLevel && skill.requiredLevel) return '#ffebee'; // Missing required skill - light red
    if (!skill.currentLevel) return '#f5f5f5'; // Missing optional skill - light grey
    
    const userLevel = skill.currentLevel;
    const requiredLevel = skill.requiredLevel || skill.recommendedLevel;
    
    if (!requiredLevel) return '#fff3e0'; // Other skills - light orange
    
    const levels = { 'BEGINNER': 1, 'INTERMEDIATE': 2, 'ADVANCED': 3 };
    const userValue = levels[userLevel] || 0;
    const requiredValue = levels[requiredLevel] || 0;
    
    if (userValue >= requiredValue) return '#e8f5e9'; // Met or exceeded - light green
    return '#fff3e0'; // Partial - light orange
  };

  if (!analysis) return <div>Loading...</div>;

  return (
    <div>
      {/* Progress Bar */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Progress: {analysis.progress}%</h3>
        <div style={{ 
          backgroundColor: '#f0f0f0', 
          borderRadius: '10px',
          height: '20px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${analysis.progress}%`,
            height: '100%',
            backgroundColor: '#4CAF50',
            transition: 'width 0.5s ease-in-out'
          }} />
        </div>
      </div>

      {/* Add New Skill */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Add New Skill</h3>
        <select
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
          style={{ padding: '5px', marginRight: '10px' }}
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
          style={{ padding: '5px', marginRight: '10px' }}
        >
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>
        <button onClick={handleAddSkill}>Add Skill</button>
      </div>

      {/* Required Skills */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Required Skills</h3>
        {analysis.completedSkills.concat(analysis.partialSkills, analysis.missingRequired)
          .filter(skill => skill.requiredLevel) // Only show required skills here
          .map(skill => (
          <div key={skill.name} style={{
            padding: '10px',
            margin: '5px 0',
            backgroundColor: getSkillColor(skill),
            borderRadius: '5px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <strong>{skill.name}</strong>
              <p style={{ margin: '5px 0', fontSize: '0.9em' }}>
                Required Level: {skill.requiredLevel}
                {skill.currentLevel && ` - Current Level: ${skill.currentLevel}`}
              </p>
              <p style={{ margin: '5px 0', fontSize: '0.8em', color: '#666' }}>
                {skill.description}
              </p>
            </div>
            {skill.currentLevel ? (
              <div>
                <select
                  value={skill.currentLevel}
                  onChange={(e) => handleUpdateProficiency(skill.name, e.target.value)}
                  style={{ marginRight: '10px' }}
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
                <button onClick={() => handleDeleteSkill(skill.name)}>Remove</button>
              </div>
            ) : (
              <span style={{ color: '#f44336' }}>Missing</span>
            )}
          </div>
        ))}
      </div>

      {/* Optional Skills */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Optional Skills</h3>
        {analysis.completedSkills.concat(analysis.missingOptional)
          .filter(skill => skill.recommendedLevel) // Only show optional skills here
          .map(skill => (
          <div key={skill.name} style={{
            padding: '10px',
            margin: '5px 0',
            backgroundColor: getSkillColor(skill),
            borderRadius: '5px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <strong>{skill.name}</strong>
              <p style={{ margin: '5px 0', fontSize: '0.9em' }}>
                Recommended Level: {skill.recommendedLevel}
                {skill.currentLevel && ` - Current Level: ${skill.currentLevel}`}
              </p>
              <p style={{ margin: '5px 0', fontSize: '0.8em', color: '#666' }}>
                {skill.description}
              </p>
            </div>
            {skill.currentLevel ? (
              <div>
                <select
                  value={skill.currentLevel}
                  onChange={(e) => handleUpdateProficiency(skill.name, e.target.value)}
                  style={{ marginRight: '10px' }}
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
                <button onClick={() => handleDeleteSkill(skill.name)}>Remove</button>
              </div>
            ) : (
              <span style={{ color: '#5c5c5c' }}>Missing</span>
            )}
          </div>
        ))}
      </div>

      {/* Other Skills */}
      {analysis.otherSkills.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Other Skills</h3>
          {analysis.otherSkills.map(skill => (
            <div key={skill.name} style={{
              padding: '10px',
              margin: '5px 0',
              backgroundColor: '#fff3e0', // Light orange for other skills
              borderRadius: '5px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong>{skill.name}</strong>
                <p style={{ margin: '5px 0', fontSize: '0.9em' }}>
                  Current Level: {skill.currentLevel}
                </p>
              </div>
              <div>
                <select
                  value={skill.currentLevel}
                  onChange={(e) => handleUpdateProficiency(skill.name, e.target.value)}
                  style={{ marginRight: '10px' }}
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
                <button onClick={() => handleDeleteSkill(skill.name)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SkillGapAnalysis;
