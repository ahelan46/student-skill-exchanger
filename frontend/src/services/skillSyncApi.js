import api from './api';

export const loginDemo = (username, password) => {
  // Save to local storage for basic auth
  localStorage.setItem('demo_username', username);
  localStorage.setItem('demo_password', password);
  // Verify by fetching my profile
  return api.get('/accounts/students/');
};

export const logoutDemo = () => {
  localStorage.removeItem('demo_username');
  localStorage.removeItem('demo_password');
};

export const getStudents = () => api.get('/accounts/students/');
export const getMyProfile = () => api.get('/accounts/students/'); // Requires filtering client-side or finding by logged in user since we don't have a /me/ endpoint
export const updateProfile = (id, data) => api.patch(`/accounts/students/${id}/`, data);

export const getSkills = () => api.get('/skills/skills/');
export const getStudentSkills = () => api.get('/skills/student-skills/');
export const addStudentSkill = (data) => api.post('/skills/student-skills/', data);
export const removeStudentSkill = (id) => api.delete(`/skills/student-skills/${id}/`);

export const getMatches = (params) => api.get('/matches/', { params });

export const sendExchangeRequest = (data) => api.post('/requests/', data);
export const getRequests = () => api.get('/requests/');
export const updateRequest = (id, data) => api.patch(`/requests/${id}/`, data);

export const getSessions = () => api.get('/sessions/');
export const createSession = (data) => api.post('/sessions/', data);
export const updateSession = (id, data) => api.patch(`/sessions/${id}/`, data);

export const getFeedback = () => api.get('/feedback/');
export const createFeedback = (data) => api.post('/feedback/', data);
