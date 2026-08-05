import React, { createContext, useState, useContext, useEffect } from 'react';
import { initialData } from '../data/initialData';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const loadData = () => {
    try {
      const saved = localStorage.getItem('portfolioData');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.personal && parsed.experience && parsed.projects) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    return initialData;
  };

  const [data, setData] = useState(loadData);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('adminAuth') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('portfolioData', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('adminAuth', String(isAuthenticated));
  }, [isAuthenticated]);

  // Experience functions
  const addExperience = (item) => {
    setData(prev => ({
      ...prev,
      experience: [...prev.experience, item]
    }));
  };

  const updateExperience = (index, item) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => i === index ? item : exp)
    }));
  };

  const deleteExperience = (index) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  // Projects functions
  const addProject = (project) => {
    setData(prev => ({
      ...prev,
      projects: [...prev.projects, project]
    }));
  };

  const updateProject = (index, project) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map((p, i) => i === index ? project : p)
    }));
  };

  const deleteProject = (index) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  // Skills functions
  const addSkill = (skill) => {
    setData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        technical: {
          ...prev.skills.technical,
          categories: [...prev.skills.technical.categories, skill]
        }
      }
    }));
  };

  const updateSkill = (index, skill) => {
    setData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        technical: {
          ...prev.skills.technical,
          categories: prev.skills.technical.categories.map((s, i) => i === index ? skill : s)
        }
      }
    }));
  };

  const deleteSkill = (index) => {
    setData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        technical: {
          ...prev.skills.technical,
          categories: prev.skills.technical.categories.filter((_, i) => i !== index)
        }
      }
    }));
  };

  // Hero stats functions
  const updateHeroStats = (stats) => {
    setData(prev => ({
      ...prev,
      heroStats: stats
    }));
  };

  // Authentication
  const login = (username, password) => {
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
  };

  const resetData = () => {
    setData(initialData);
    localStorage.setItem('portfolioData', JSON.stringify(initialData));
  };

  return (
    <DataContext.Provider value={{
      data,
      setData,
      isAuthenticated,
      login,
      logout,
      resetData,
      addExperience,
      updateExperience,
      deleteExperience,
      addProject,
      updateProject,
      deleteProject,
      addSkill,
      updateSkill,
      deleteSkill,
      updateHeroStats
    }}>
      {children}
    </DataContext.Provider>
  );
};