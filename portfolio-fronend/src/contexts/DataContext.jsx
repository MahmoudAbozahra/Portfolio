import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient, { setCsrfToken } from '../lib/apiClient';

const DataContext = createContext(null);
const portfolioKey = ['portfolio'];

export const useData = () => {
  const context = React.useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};

export const DataProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const sessionRefreshStarted = useRef(false);
  const portfolioQuery = useQuery({ queryKey: portfolioKey, queryFn: async () => (await apiClient.get('/portfolio')).data });

  const clearSession = useCallback(() => {
    setCsrfToken(null);
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/auth/me');
      setCsrfToken(data.csrfToken);
      setIsAuthenticated(true);
      setUser(data.user);
      return data.user;
    } catch {
      clearSession();
      return null;
    } finally {
      setAuthLoading(false);
    }
  }, [clearSession]);

  useEffect(() => {
    if (!sessionRefreshStarted.current) {
      sessionRefreshStarted.current = true;
      refreshSession();
    }
    const expired = () => clearSession();
    window.addEventListener('portfolio:session-expired', expired);
    return () => window.removeEventListener('portfolio:session-expired', expired);
  }, [refreshSession, clearSession]);

  const setPortfolio = (value) => queryClient.setQueryData(portfolioKey, value);
  const fetchData = () => queryClient.fetchQuery({ queryKey: portfolioKey, queryFn: async () => (await apiClient.get('/portfolio')).data });
  const login = async (username, password) => {
    try {
      const { data } = await apiClient.post('/auth/login', { username, password });
      setCsrfToken(data.csrfToken);
      setIsAuthenticated(true);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };
  const logout = async () => {
    try { await apiClient.post('/auth/logout'); } catch { /* Local state still clears if the server session already expired. */ }
    finally { clearSession(); queryClient.removeQueries({ queryKey: ['users'] }); }
  };
  const saveData = async (newData) => { const { data } = await apiClient.put('/portfolio', newData); setPortfolio(data); return data; };
  const updatePersonal = async (personalData) => { const { data } = await apiClient.put('/portfolio/personal', personalData); setPortfolio(data); return data; };

  const data = portfolioQuery.data;
  const replaceArray = (field, items) => saveData({ ...data, [field]: items });
  const addExperience = (item) => replaceArray('experience', [...(data.experience || []), item]);
  const updateExperience = (index, item) => replaceArray('experience', data.experience.map((value, position) => position === index ? item : value));
  const deleteExperience = (index) => replaceArray('experience', data.experience.filter((_, position) => position !== index));
  const addProject = async (project) => { const response = await apiClient.post('/portfolio/projects', project); setPortfolio(response.data.portfolio); return response.data.project; };
  const updateProject = async (projectId, project) => { const response = await apiClient.put(`/portfolio/projects/${projectId}`, project); setPortfolio(response.data.portfolio); return response.data.project; };
  const deleteProject = async (projectId) => { const response = await apiClient.delete(`/portfolio/projects/${projectId}`); setPortfolio(response.data.portfolio); return response.data; };
  const categories = data?.skills?.technical?.categories || [];
  const saveCategories = (next) => saveData({ ...data, skills: { ...data.skills, technical: { ...data.skills.technical, categories: next } } });
  const addSkill = (skill) => saveCategories([...categories, skill]);
  const updateSkill = (index, skill) => saveCategories(categories.map((item, position) => position === index ? skill : item));
  const deleteSkill = (index) => saveCategories(categories.filter((_, position) => position !== index));
  const updateHeroStats = (heroStats) => saveData({ ...data, heroStats });
  const resetData = async () => { await apiClient.delete('/portfolio', { headers: { 'X-Confirm-Reset': 'RESET_PORTFOLIO' } }); return fetchData(); };

  const value = useMemo(() => ({
    data, loading: portfolioQuery.isPending, error: portfolioQuery.error?.message || null,
    isAuthenticated, user, authLoading, login, logout, refreshSession, fetchData, saveData, updatePersonal,
    addExperience, updateExperience, deleteExperience, addProject, updateProject, deleteProject,
    addSkill, updateSkill, deleteSkill, updateHeroStats, resetData
  }), [data, portfolioQuery.isPending, portfolioQuery.error, isAuthenticated, user, authLoading, refreshSession]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
