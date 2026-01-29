import api from './api';

export const assignmentService = {
    getAll: async (params) => {
        const response = await api.get('/assignments/', { params });
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/assignments/', data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/assignments/${id}/`);
        return response.data;
    },

    getMyAssignments: async (params) => {
        const response = await api.get('/assignments/my_assignments/', { params });
        return response.data;
    }
};
