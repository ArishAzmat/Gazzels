import api from './api';

export const courseService = {
    getAll: async (params) => {
        const response = await api.get('/courses/', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/courses/${id}/`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/courses/', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/courses/${id}/`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/courses/${id}/`);
        return response.data;
    },

    // Lessons
    createLesson: async (courseId, data) => {
        const response = await api.post('/courses/lessons/', { ...data, course: courseId });
        return response.data;
    },

    updateLesson: async (id, data) => {
        const response = await api.put(`/courses/lessons/${id}/`, data);
        return response.data;
    },

    deleteLesson: async (id) => {
        const response = await api.delete(`/courses/lessons/${id}/`);
        return response.data;
    }
};
