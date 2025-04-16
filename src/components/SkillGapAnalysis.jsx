import React, { useState, useEffect } from 'react';

const SkillGapAnalysis = ({ userId }) => {
  const [analysis, setAnalysis] = useState(null);
  const [skillInput, setSkillInput] = useState('');
  const [proficiency, setProficiency] = useState('BEGINNER');
  const [userSkills, setUserSkills] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGapAnalysis();
  }, [userId]);

  const fetchGapAnalysis = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/skills/user/${userId}/gap-analysis`);
      const data = await response.json();
      setAnalysis(data);
      setUserSkills(data.currentSkills || []);
    } catch (err) {
      setError('Failed to load gap analysis');
    }
  };

  const handleAddSkill = async () => {
    if (!skillInput) return;

    const updatedSkills = [
      ...userSkills,
      { name: skillInput, proficiency }
    ];

    try {
      const response = await fetch(`http://localhost:8080/api/skills/user/${userId}/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSkills),
      });

      if (response.ok) {
        setSkillInput('');
        setProficiency('BEGINNER');
        fetchGapAnalysis();
      }
    } catch (err) {
      setError('Failed to add skill');
    }
  };

  if (!analysis) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Skill Gap Analysis</h2>
      
      {/* Progress Bars */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Overall Skill Progress</h3>
        <div style={{ 
          width: '100%', 
          backgroundColor: '#eee',
          borderRadius: '10px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${analysis.progress}%`,
            backgroundColor: '#4CAF50',
            height: '20px',
            transition: 'width 0.5s ease-in-out'
          }} />
        </div>
        <div style={{ textAlign: 'center', marginTop: '5px' }}>
          {analysis.progress}%
        </div>
      </div>

      {/* Add New Skill */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Add New Skill</h3>
        <input
          type="text"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          placeholder="Skill Name"
          style={{ padding: '5px', marginRight: '10px' }}
        />
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

      {/* Current Skills */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Current Skills</h3>
        {userSkills.map((skill, index) => (
          <div key={index} style={{
            padding: '10px',
            margin: '5px 0',
            backgroundColor: '#f5f5f5',
            borderRadius: '5px'
          }}>
            {skill.skillName} - {skill.proficiency}
          </div>
        ))}
      </div>

      {/* Missing Skills */}
      {analysis.missingSkills.length > 0 && (
        <div>
          <h3>Missing Required Skills</h3>
          {analysis.missingSkills.map((skill, index) => (
            <div key={index} style={{
              padding: '10px',
              margin: '5px 0',
              backgroundColor: '#ffebee',
              borderRadius: '5px'
            }}>
              {skill.name}
            </div>
          ))}
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SkillGapAnalysis;
