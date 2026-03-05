import { api } from '../utils/api'; 

/**
 * Envoie l'URL du repository Git au backend pour déclencher le scan
 */
export const createProjectScan = (url, userId) => {
    return api.post('/project', { url, userId });
};

export const createZipScan = async (file, userId) => {
    const formData = new FormData();
    formData.append('zipFile', file);
    formData.append('userId', userId);
    formData.append('projectName', file.name.replace('.zip', ''));

    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch (`${apiUrl}/project/scan-zip`, {
        method: 'Post',
        body: formData,
    });

    if(!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'analyse ZIP');
    }

    return response.json();
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

