import { useState, useEffect } from 'react';
import axios from 'axios';

import SkillPreview from "../components/SkillPreview";

const API_URL = 'http://localhost:8080/api/';

function RoleSelect() {
    const [categories, setCategories] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);

    const getRoles = async () => {
        try {
            const response = await axios.get(API_URL + 'roles');
            setCategories(Object.keys(response.data));
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    useEffect(() => {
        getRoles();
    }, []);

    const handleCategorySelect = (e) => {
        setSelectedCategory(e.target.value);
        setSelectedRole(null);
    };

    const handleRoleSelect = (e) => {
        const roleId = e.target.value;
        setSelectedRole(roleId);
    };

    return (
        <div className="role-select">
            <h2>Select Your Target Role</h2>

            <select value={selectedCategory} onChange={handleCategorySelect}>
                <option value="">Select Category</option>
                {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                ))}
            </select>

            {selectedCategory && (
                <select value={selectedRole || ''} onChange={handleRoleSelect}>
                    <option value="">Select Role</option>
                    {roles[selectedCategory]?.map(role => (
                        <option key={role.id} value={role.id}>{role.title}</option>
                    ))}
                </select>
            )}

            <SkillPreview roleId={selectedRole} />
        </div>

    );
}

export default RoleSelect;
