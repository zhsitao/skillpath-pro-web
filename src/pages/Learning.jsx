import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Learning = () => {
  const navigate = useNavigate();
  const [freeOnly, setFreeOnly] = useState(false);
  const [courses, setCourses] = useState([]);
  const [myPlan, setMyPlan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId] = useState(1); // In a real app, get this from authentication

  useEffect(() => {
    fetchResources();
    fetchUserPlan();
  }, []);

  useEffect(() => {
    fetchResources();
  }, [freeOnly]);

  const fetchResources = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/learning/resources?freeOnly=${freeOnly}`);
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
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
          {
            method: 'POST'
          }
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
          headers: {
            'Content-Type': 'application/json'
          },
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

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
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

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Left sidebar - Filters */}
        <div style={{ flex: '0 0 200px' }}>
          <h3>Filters</h3>
          <label>
            <input
              type="checkbox"
              checked={freeOnly}
              onChange={(e) => setFreeOnly(e.target.checked)}
            />
            Free Resources Only
          </label>
        </div>

        {/* Middle section - Course list */}
        <div style={{ flex: '1' }}>
          <h2>Available Courses</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            courses.map(course => (
              <div
                key={course.id}
                style={{
                  padding: '15px',
                  marginBottom: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
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
                </div>
                <button
                  onClick={() => handleAddToPlan(course)}
                  disabled={myPlan.some(item => item.id === course.id)}
                  style={{
                    padding: '8px 16px',
                    cursor: 'pointer',
                    opacity: myPlan.some(item => item.id === course.id) ? 0.5 : 1
                  }}
                >
                  {myPlan.some(item => item.id === course.id) ? 'Added to Plan' : 'Add to Plan'}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Right sidebar - My Learning Plan */}
        <div style={{ flex: '0 0 300px' }}>
          <h2>My Learning Plan</h2>
          {myPlan.map(course => (
            <div
              key={course.id}
              style={{
                padding: '10px',
                marginBottom: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px'
              }}
            >
              <h4 style={{ margin: '0 0 5px 0' }}>{course.name}</h4>
              <select
                value={course.status}
                onChange={(e) => handleStatusChange(course.id, e.target.value)}
                style={{ width: '100%', marginTop: '5px' }}
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
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
