import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_URL;

const API_URL = `${API_BASE_URL}/api/portfolio`;
const AUTH_URL = `${API_BASE_URL}/api/auth`;

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }

  return context;
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');

    return token
      ? { Authorization: `Bearer ${token}` }
      : {};
  };

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('adminToken');

      if (token) {
        try {
          const response = await axios.get(`${AUTH_URL}/verify`, {
            headers: getAuthHeaders()
          });

          setIsAuthenticated(true);
          setUser(response.data.user);
        } catch (err) {
          localStorage.removeItem('adminToken');
          setIsAuthenticated(false);
          setUser(null);
        }
      }

      setAuthLoading(false);
    };

    verifyToken();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API_URL);

      setData(response.data);
      setError(null);

      localStorage.setItem('portfolioData', JSON.stringify(response.data));

      return response.data;
    } catch (err) {
      console.error('❌ Error fetching data:', err);

      setError(
        'Failed to load data from server. Please make sure the backend is running.'
      );

      const saved = localStorage.getItem('portfolioData');

      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setData(parsed);
          setError('⚠️ Using cached data. Backend might be offline.');
          return parsed;
        } catch {
          setError('❌ No cached data available.');
        }
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData().catch(() => {});
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${AUTH_URL}/login`, {
        username,
        password
      });

      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token);
        setIsAuthenticated(true);
        setUser(response.data.user);

        return { success: true };
      }

      return {
        success: false,
        error: 'Invalid credentials'
      };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Login failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  const saveData = async (newData) => {
    try {
      const response = await axios.put(API_URL, newData, {
        headers: getAuthHeaders()
      });

      setData(response.data);
      localStorage.setItem('portfolioData', JSON.stringify(response.data));

      return response.data;
    } catch (err) {
      console.error('Error saving data:', err);
      throw err;
    }
  };

  const updatePersonal = async (personalData) => {
    try {
      const response = await axios.put(
        `${API_URL}/personal`,
        personalData,
        { headers: getAuthHeaders() }
      );

      setData(response.data);
      return response.data;
    } catch (err) {
      console.error('Error updating personal info:', err);
      throw err;
    }
  };

  /* =========================
     EXPERIENCE
     ========================= */

  const addExperience = async (item) => {
    const newData = {
      ...data,
      experience: [...(data.experience || []), item]
    };

    return saveData(newData);
  };

  const updateExperience = async (index, item) => {
    const newExperience = (data.experience || []).map((exp, i) =>
      i === index ? item : exp
    );

    return saveData({
      ...data,
      experience: newExperience
    });
  };

  const deleteExperience = async (index) => {
    const newExperience = (data.experience || []).filter(
      (_, i) => i !== index
    );

    return saveData({
      ...data,
      experience: newExperience
    });
  };

  /* =========================
     PROJECTS
     Uses MongoDB subdocument _id
     ========================= */

  const addProject = async (project) => {
    try {
      const response = await axios.post(
        `${API_URL}/projects`,
        project,
        { headers: getAuthHeaders() }
      );

      setData(response.data.portfolio);
      localStorage.setItem(
        'portfolioData',
        JSON.stringify(response.data.portfolio)
      );

      return response.data.project;
    } catch (err) {
      console.error('Error adding project:', err);
      throw err;
    }
  };

  const updateProject = async (projectId, project) => {
    try {
      const response = await axios.put(
        `${API_URL}/projects/${projectId}`,
        project,
        { headers: getAuthHeaders() }
      );

      setData(response.data.portfolio);
      localStorage.setItem(
        'portfolioData',
        JSON.stringify(response.data.portfolio)
      );

      return response.data.project;
    } catch (err) {
      console.error('Error updating project:', err);
      throw err;
    }
  };

  const deleteProject = async (projectId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/projects/${projectId}`,
        { headers: getAuthHeaders() }
      );

      setData(response.data.portfolio);
      localStorage.setItem(
        'portfolioData',
        JSON.stringify(response.data.portfolio)
      );

      return response.data;
    } catch (err) {
      console.error('Error deleting project:', err);
      throw err;
    }
  };

  /* =========================
     SKILLS
     ========================= */

  const addSkill = async (skill) => {
    const categories = data?.skills?.technical?.categories || [];

    return saveData({
      ...data,
      skills: {
        ...data.skills,
        technical: {
          ...data.skills.technical,
          categories: [...categories, skill]
        }
      }
    });
  };

  const updateSkill = async (index, skill) => {
    const categories = data?.skills?.technical?.categories || [];

    const newCategories = categories.map((item, i) =>
      i === index ? skill : item
    );

    return saveData({
      ...data,
      skills: {
        ...data.skills,
        technical: {
          ...data.skills.technical,
          categories: newCategories
        }
      }
    });
  };

  const deleteSkill = async (index) => {
    const categories = data?.skills?.technical?.categories || [];

    const newCategories = categories.filter((_, i) => i !== index);

    return saveData({
      ...data,
      skills: {
        ...data.skills,
        technical: {
          ...data.skills.technical,
          categories: newCategories
        }
      }
    });
  };

  const updateHeroStats = async (stats) => {
    return saveData({
      ...data,
      heroStats: stats
    });
  };

  const resetData = async () => {
    try {
      await axios.delete(API_URL, {
        headers: getAuthHeaders()
      });

      return fetchData();
    } catch (err) {
      console.error('Error resetting data:', err);
      throw err;
    }
  };

  const value = {
    data,
    loading,
    error,

    isAuthenticated,
    user,
    authLoading,

    login,
    logout,

    fetchData,
    saveData,
    updatePersonal,

    addExperience,
    updateExperience,
    deleteExperience,

    addProject,
    updateProject,
    deleteProject,

    addSkill,
    updateSkill,
    deleteSkill,

    updateHeroStats,
    resetData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};