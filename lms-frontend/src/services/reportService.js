import api from './api';

export const reportService = {
    getDashboardStats: async () => {
        const response = await api.get('/reports/dashboard-stats/');
        return response.data;
    },

    getEmployeeProgress: async (params = {}) => {
        const response = await api.get('/reports/employee-progress/', { params });
        return response.data;
    },

    getCourseCompletion: async (params = {}) => {
        const response = await api.get('/reports/course-completion/', { params });
        return response.data;
    },

    exportReport: async (reportType, params = {}) => {
        const response = await api.get(`/reports/export/${reportType}/`, {
            params,
            responseType: 'blob',
        });
        return response.data;
    },
};
