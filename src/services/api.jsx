import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/learning';

const api = {
    getResources: async (filters) => {
        const response = await axios.get(`${API_BASE_URL}/resources`, { params: filters });
        return response.data;
    },

    getResourceById: async (id) => {
        const response = await axios.get(`${API_BASE_URL}/resources/${id}`);
        return response.data;
    },

    getUserPlan: async (userId) => {
        const response = await axios.get(`${API_BASE_URL}/plan/${userId}`);
        return response.data;
    },

    addToPlan: async (userId, resourceId) => {
        return axios.post(`${API_BASE_URL}/plan/${userId}/add/${resourceId}`);
    },

    markAsCompleted: async (userId, resourceId) => {
        return axios.post(`${API_BASE_URL}/plan/${userId}/complete/${resourceId}`);
    },

    removeFromPlan: async (userId, resourceId) => {
        return axios.delete(`${API_BASE_URL}/plan/${userId}/remove/${resourceId}`);
    }
};

export default api;