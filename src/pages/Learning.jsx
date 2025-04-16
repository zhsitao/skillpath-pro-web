import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Learning = () => {
  const navigate = useNavigate();
  const [freeOnly, setFreeOnly] = useState(false);
  const [courses, setCourses] = useState([]);
  const [myPlan, setMyPlan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId] = useState(1); // In a real app, get this from authentication
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [maxDuration, setMaxDuration] = useState('');
  const [allSkills, setAllSkills] = useState([]);
  const [skillGaps, setSkillGaps] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  const courseTypes = ['Course', 'Certification'];

  useEffect(() => {
    fetchUserRoleAndGaps();
  }, []);

  useEffect(() => {
    if (selectedRoleId) {
      fetchResources();
      fetchUserPlan();
    }
  }, [selectedRoleId, freeOnly]);

  const fetchUserRoleAndGaps = async () => {
    try {
      const rolesResponse = await fetch(`http://localhost:8080/api/users/${userId}/roles`);
      if (!rolesResponse.ok) return;
      const roles = await rolesResponse.json();

      if (roles.length === 0) {
        setLoading(false);
        return;
      }

      const roleId = roles[0].id;
      setSelectedRoleId(roleId);

      const gapsResponse = await fetch(`http://localhost:8080/api/users/${userId}/roles/${roleId}/gap-analysis`);
      if (!gapsResponse.ok) return;
      const gapsData = await gapsResponse.json();

      const gaps = [
        ...gapsData.missingRequired.map(skill => skill.name),
        ...gapsData.missingOptional.map(skill => skill.name),
        ...gapsData.partialSkills.map(skill => skill.name)
      ];
      setSkillGaps(gaps);
    } catch (error) {
      console.error('Failed to fetch role and gaps:', error);
    }
  };

  const fetchResources = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/learning/resources?freeOnly=${freeOnly}`);
      if (response.ok) {
        const data = await response.json();
        setCourses(data);

        const skills = new Set();
        data.forEach(course => {
          course.relatedSkills.forEach(skill => skills.add(skill));
        });
        setAllSkills(Array.from(skills).sort());
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      setLoading(false);
    }
  };

  const fetchUserPlan = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/learning/users/${userId}/plan`);
      if (response.ok) {
        const data = await response.json();
        setMyPlan(data);
      }
    } catch (error) {
      console.error('Failed to fetch user plan:', error);
    }
  };

  const handleAddToPlan = async (course) => {
    if (!myPlan.find(item => item.id === course.id)) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/learning/users/${userId}/plan/${course.id}`,
          { method: 'POST' }
        );
        if (response.ok) {
          await fetchUserPlan();
        }
      } catch (error) {
        console.error('Failed to add to plan:', error);
      }
    }
  };

  const handleStatusChange = async (courseId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/learning/users/${userId}/plan/${courseId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        }
      );
      if (response.ok) {
        await fetchUserPlan();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleRemoveFromPlan = async (courseId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/learning/users/${userId}/plan/${courseId}`,
        { method: 'DELETE' }
      );
      if (response.ok) {
        await fetchUserPlan();
      }
    } catch (error) {
      console.error('Failed to remove from plan:', error);
    }
  };

  const getFilteredCourses = () => {
    return courses.filter(course => {
      if (!selectedRoleId || skillGaps.length === 0) return false;

      const isRelevantToGaps = course.relatedSkills.some(skill => skillGaps.includes(skill));
      if (!isRelevantToGaps) return false;

      if (selectedSkill && !course.relatedSkills.includes(selectedSkill)) return false;

      if (selectedType && course.type !== selectedType) return false;

      if (maxDuration) {
        const duration = parseInt(course.duration);
        if (isNaN(duration) || duration > parseInt(maxDuration)) return false;
      }

      return true;
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return '#4CAF50';
      case 'In Progress': return '#FFA726';
      default: return '#757575';
    }
  };

  const filteredCourses = getFilteredCourses();

  if (!selectedRoleId) {
    return (
      <div style={{ maxWidth: '800px', margin: '100px auto', textAlign: 'center' }}>
        <h2>No Role Selected</h2>
        <p>Please select a role in the Dashboard first to view relevant learning resources.</p>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>Learning Resources</h1>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Back to Dashboard
          </button>
        </div>

        {/* Filters at the top */}
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '5px',
          alignItems: 'center'
        }}>
          <div>
            <label style={{ marginRight: '10px' }}>
              <input
                type="checkbox"
                checked={freeOnly}
                onChange={(e) => setFreeOnly(e.target.checked)}
              />
              Free Resources Only
            </label>
          </div>

          <div>
            <label style={{ marginRight: '10px' }}>Skills:</label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              style={{ padding: '5px' }}
            >
              <option value="">All Skills</option>
              {skillGaps.map(skill => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ marginRight: '10px' }}>Type:</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{ padding: '5px' }}
            >
              <option value="">All Types</option>
              <option value="Course">Course</option>
              <option value="Video">Video</option>
              <option value="Certificate">Certificate</option>
            </select>
          </div>

          <div>
            <label style={{ marginRight: '10px' }}>Max Duration:</label>
            <input
              type="number"
              value={maxDuration}
              onChange={(e) => setMaxDuration(e.target.value)}
              style={{ width: '70px', padding: '5px' }}
              min="0"
            />
            <span style={{ marginLeft: '5px' }}>hours</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Main content - Course list */}
        <div style={{ flex: '1' }}>
          <h2>Available Courses</h2>
          {loading ? (
            <p>Loading...</p>
          ) : skillGaps.length === 0 ? (
            <p>Great job! You've met all required skills.</p>
          ) : filteredCourses.length === 0 ? (
            <p>No courses match your current filters.</p>
          ) : (
            filteredCourses.map(course => (
              <div
                key={course.id}
                style={{
                  padding: '15px',
                  marginBottom: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 5px 0' }}>{course.name}</h3>
                    <p style={{ margin: '0', color: '#666' }}>
                      {course.provider} • {course.duration} • {course.type}
                    </p>
                    <p style={{ margin: '5px 0 0 0', color: course.cost === 0 ? '#4CAF50' : '#666' }}>
                      {course.cost === 0 ? 'Free' : `$${course.cost}`}
                    </p>
                    {course.description && (
                      <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.9em' }}>
                        {course.description}
                      </p>
                    )}
                    <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.9em' }}>
                      Skills: {course.relatedSkills.join(', ')}
                    </p>
                  </div>
                  <div style={{ marginLeft: '20px' }}>
                    {myPlan.find(item => item.id === course.id) ? (
                      <div style={{
                        padding: '8px 16px',
                        borderRadius: '4px',
                        backgroundColor: getStatusColor(myPlan.find(item => item.id === course.id).status),
                        color: 'white',
                        fontSize: '0.9em'
                      }}>
                        {myPlan.find(item => item.id === course.id).status}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToPlan(course)}
                        style={{
                          padding: '8px 16px',
                          cursor: 'pointer',
                          backgroundColor: '#2196F3',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px'
                        }}
                      >
                        Add to Plan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right sidebar - My Learning Plan */}
        <div style={{ width: '300px' }}>
          <h2>My Learning Plan</h2>
          {myPlan.map(course => (
            <div
              key={course.id}
              style={{
                padding: '15px',
                marginBottom: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                position: 'relative'
              }}
            >
              <button
                onClick={() => handleRemoveFromPlan(course.id)}
                style={{
                  position: 'absolute',
                  right: '5px',
                  top: '5px',
                  background: 'none',
                  border: 'none',
                  fontSize: '16px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
              <h4 style={{ margin: '0 0 10px 0', paddingRight: '20px' }}>{course.name}</h4>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['Not Started', 'In Progress', 'Completed'].map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(course.id, status)}
                    style={{
                      flex: 1,
                      padding: '5px',
                      backgroundColor: course.status === status ? getStatusColor(status) : '#f5f5f5',
                      color: course.status === status ? 'white' : '#666',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '0.8em'
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {myPlan.length === 0 && (
            <p style={{ color: '#666', textAlign: 'center' }}>
              No courses added to your plan yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Learning;
