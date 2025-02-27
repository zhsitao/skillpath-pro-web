import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const API_URL = 'http://localhost:8080/api/';

function SkillPreview({ roleId }) {
    const [skills, setSkills] = useState([]);

    const getSkills = async (roleId) => {
        if (!roleId) {
            setSkills([]);
            return;
        }
        try {
            const response = await axios.get(API_URL + `skills?roleId=${roleId}`);
            const groupedSkills = response.data.reduce((acc, skill) => {
                if (!acc[skill.category]) {
                    acc[skill.category] = [];
                }
                acc[skill.category].push(skill);
                return acc;
            }, {});
            setSkills(groupedSkills);
        } catch (error) {
            console.error('Error fetching skills:', error);
            setSkills([]);
        }
    }

    useEffect(() => {
        getSkills(roleId);
    }, [roleId]);

    return (
        <div className="skill-preview">
            <h2>Required Skills</h2>
            {Object.entries(skills).map(([category, categorySkills]) => (
                <div key={category} className="skill-category">
                    <h3>{category}</h3>
                    <ul>
                        {categorySkills.map(skill => (
                            <li key={skill.id}>{skill.name}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

SkillPreview.propTypes = {
    roleId: PropTypes.string.isRequired,
};

export default SkillPreview;
