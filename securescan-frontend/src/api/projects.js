import { api } from '../utils/api'; 

/**
 * Envoie l'URL du repository Git au backend pour déclencher le scan
 */
export const createProjectScan = (url, userId) => {
    return api.post('/project', { url, userId });
};

// export const getProjectById = (id) => api.get(`/project/${id}`);
// export const getAllProjects = () => api.get('/project');