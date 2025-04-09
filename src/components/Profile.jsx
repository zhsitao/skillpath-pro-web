import React, { useState, useEffect } from 'react';
import { getProfile} from '../api/profile';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [careerStage, setCareerStage] = useState('');
  const [skills, setSkills] = useState([]);
  const [workExperience, setWorkExperience] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Predefined options
  const careerStageOptions = ['Recent Graduate', 'Junior', 'Mid-Level', 'Senior'];
  const skillsOptions = ['Python', 'Git', 'React', 'Spring Boot', 'SQL'];
  const workExperienceOptions = ['0-1 years', '1-3 years', '3+ years'];

  // Fetch profile data on component load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        setCareerStage(profile.careerStage || '');
        setSkills(profile.skills || []);
        setWorkExperience(profile.workExperience || '');
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Profile not found. Please customize your profile.');
      }
    };

    fetchProfile();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (!careerStage) {
      setError('Career stage is required.');
      setLoading(false);
      return;
    }

    try {
      await updateProfile({ careerStage, skills, workExperience });
      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        {/* Career Stage Dropdown */}
        <div>
          <label htmlFor="careerStage">Career Stage:</label>
          <select
            id="careerStage"
            value={careerStage}
            onChange={(e) => setCareerStage(e.target.value)}
            required
          >
            <option value="">Select Career Stage</option>
            {careerStageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Skills Multi-Select */}
        <div>
          <label htmlFor="skills">Skills:</label>
          <select
            id="skills"
            multiple
            value={skills}
            onChange={(e) =>
              setSkills(Array.from(e.target.selectedOptions, (option) => option.value))
            }
          >
            {skillsOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Work Experience Dropdown */}
        <div>
          <label htmlFor="workExperience">Work Experience:</label>
          <select
            id="workExperience"
            value={workExperience}
            onChange={(e) => setWorkExperience(e.target.value)}
          >
            <option value="">Select Work Experience</option>
            {workExperienceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Error and Success Messages */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

        {/* Save Changes Button */}
        <button type="submit" disabled={loading} style={{ marginTop: '20px' }}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default Profile;