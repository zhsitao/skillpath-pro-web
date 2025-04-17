import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Learning = () => {
  const navigate = useNavigate();
  const [freeOnly, setFreeOnly] = useState(false);
  const [courses, setCourses] = useState([]);
  const [myPlan, setMyPlan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [maxDuration, setMaxDuration] = useState('');
  const [allSkills, setAllSkills] = useState([]);
  const [skillGaps, setSkillGaps] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  // Get userId from localStorage
  const [userId] = useState(() => {
    const id = localStorage.getItem('userId');
    if (!id) {
      navigate('/login');
      return null;
    }
    return parseInt(id);
  });

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
      <div className="container">
        <div className="card" style={{ maxWidth: '800px', margin: '100px auto', textAlign: 'center' }}>
          <h2>No Role Selected</h2>
          <p>Please select a role in the Dashboard first to view relevant learning resources.</p>
          <button
            onClick={() => navigate('/dashboard', { replace: true })}
            style={{ marginTop: '20px' }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="flex flex-between flex-center" style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Learning Resources</h1>
        <button className="secondary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ 
          display: 'grid',
          gap: '1.5rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          alignItems: 'end'
        }}>
          <div>
            <label className="form-group">
              <input
                type="checkbox"
                checked={freeOnly}
                onChange={(e) => setFreeOnly(e.target.checked)}
                style={{ width: 'auto', margin: '0 8px 0 0' }}
              />
              Free Resources Only
            </label>
          </div>

          <div className="form-group">
            <label>Skills</label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              style={{ margin: 0 }}
            >
              <option value="">All Skills</option>
              {skillGaps.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{ margin: 0 }}
            >
              <option value="">All Types</option>
              <option value="Course">Course</option>
              <option value="Video">Video</option>
              <option value="Certificate">Certificate</option>
            </select>
          </div>

          <div className="form-group">
            <label>Max Duration (hours)</label>
            <input
              type="number"
              value={maxDuration}
              onChange={(e) => setMaxDuration(e.target.value)}
              style={{ margin: 0 }}
              min="0"
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr 300px' }}>
        {/* Main content - Course list */}
        <div>
          <h2>Available Courses</h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <h3>Loading...</h3>
            </div>
          ) : skillGaps.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <h3 style={{ margin: 0 }}>Great job! You've met all required skills.</h3>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <h3 style={{ margin: 0 }}>No courses match your current filters.</h3>
            </div>
          ) : (
            filteredCourses.map(course => (
              <div
                key={course.id}
                className="card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem'
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0 }}>{course.name}</h3>
                  <p style={{ margin: '0.5rem 0', color: '#666' }}>
                    {course.provider} • {course.duration} hours • {course.type}
                  </p>
                  <p style={{ 
                    margin: '0.5rem 0 0 0', 
                    color: course.cost === 0 ? '#059669' : '#666',
                    fontWeight: course.cost === 0 ? 500 : 400
                  }}>
                    {course.cost === 0 ? 'Free' : `$${course.cost}`}
                  </p>
                  {course.description && (
                    <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.9em' }}>
                      {course.description}
                    </p>
                  )}
                  <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9em' }}>
                    Skills: {course.relatedSkills.join(', ')}
                  </p>
                </div>
                <div style={{ minWidth: '120px', textAlign: 'right' }}>
                  {myPlan.find(item => item.id === course.id) ? (
                    <div style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      backgroundColor: getStatusColor(myPlan.find(item => item.id === course.id).status),
                      color: 'white',
                      fontSize: '0.9em',
                      display: 'inline-block'
                    }}>
                      {myPlan.find(item => item.id === course.id).status}
                    </div>
                  ) : (
                    <button onClick={() => handleAddToPlan(course)}>
                      Add to Plan
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right sidebar - My Learning Plan */}
        <div>
          <h2>My Learning Plan</h2>
          {myPlan.map(course => (
            <div
              key={course.id}
              className="card"
              style={{ position: 'relative' }}
            >
              <button
                onClick={() => handleRemoveFromPlan(course.id)}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '0.5rem',
                  padding: '4px 8px',
                  minWidth: 'auto',
                  fontSize: '1.2em',
                  lineHeight: 1,
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#666',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
              <h4 style={{ margin: '0 0 1rem 0', paddingRight: '1.5rem' }}>{course.name}</h4>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['Not Started', 'In Progress', 'Completed'].map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(course.id, status)}
                    className={course.status === status ? '' : 'secondary'}
                    style={{
                      flex: 1,
                      padding: '4px 8px',
                      fontSize: '0.8em',
                      minWidth: 'auto'
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {myPlan.length === 0 && (
            <div className="card" style={{ textAlign: 'center', color: '#666' }}>
              No courses added to your plan yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Learning;
