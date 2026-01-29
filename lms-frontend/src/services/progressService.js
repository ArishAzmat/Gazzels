import api from './api';

export const progressService = {
    markComplete: async (data) => {
        const response = await api.post('/progress/mark_complete/', data);
        return response.data;
    },
};
