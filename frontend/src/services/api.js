import axios from 'axios'
 
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
})
 
// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
 
// Auth APIs
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
}
 
// Resume APIs
export const resumeAPI = {
  upload: (formData) => api.post('/resume/upload', formData),
  getAll: () => api.get('/resume'),
  getById: (id) => api.get(`/resume/${id}`),
  delete: (id) => api.delete(`/resume/${id}`),
  analyze: (id) => api.post(`/resume/${id}/analyze`),
}
 
// Roadmap APIs
export const roadmapAPI = {
  generate: (data) => api.post('/roadmap/generate', data),
  getAll: () => api.get('/roadmap'),
  getById: (id) => api.get(`/roadmap/${id}`),
  updateProgress: (id, data) => api.put(`/roadmap/${id}/progress`, data),
}
 
// Interview APIs
export const interviewAPI = {
  getQuestions: (data) => api.post('/interview/questions', data),
  submitAnswer: (data) => api.post('/interview/answer', data),
  getHistory: () => api.get('/interview/history'),
}
 
// Analytics APIs
export const analyticsAPI = {
  getSummary: () => api.get('/analytics/summary'),
  getSkillGap: () => api.get('/analytics/skill-gap'),
  getProgress: () => api.get('/analytics/progress'),
  getReadiness: () => api.get('/analytics/readiness'),
}

export const dashboardAPI = {
  getSummary: () => api.get('/dashboard/summary'),
};

export const companyPrepAPI = {
  getCompanies: () => api.get('/company-prep'),
  getCompanyDetail: (id, role) => api.get(`/company-prep/${id}`, { params: { role } }),
};

export const progressAPI = {
  getSummary: () => api.get('/progress/summary'),
};






 
export default api
