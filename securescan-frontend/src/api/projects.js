import { api } from '../utils/api'; 

/**
 * Envoie l'URL du repository Git au backend pour déclencher le scan
 */
export const createProjectScan = (url, userId) => {
    return api.post('/project', { url, userId });
};

export const getProjectDashboardData = (projectId) => {
    return api.get(`/project/${projectId}/dashboard`);
};

export const getUserProjects = (userId) => {
    return api.get(`/project?userId=${userId}`);
};

export const deleteProjectScan = (projectId) => {
    return api.delete(`/project/${projectId}`);
};