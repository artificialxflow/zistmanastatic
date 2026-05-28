/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { EcoProject } from './types';
import { initialProjects } from './data/mockData';
import LandingView from './components/LandingView';
import AdminView from './components/AdminView';
import NotificationToast from './components/NotificationToast';

export default function App() {
  const [activeView, setActiveView] = useState<'landing' | 'admin'>('landing');
  const [projects, setProjects] = useState<EcoProject[]>([]);
  
  // Custom eco-toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'info' } | null>(null);

  // Initialize and hydrate data from localStorage (or initial mock)
  useEffect(() => {
    const saved = localStorage.getItem('sustainapulse_projects');
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch (err) {
        setProjects(initialProjects);
      }
    } else {
      setProjects(initialProjects);
    }
  }, []);

  // Save projects to localStorage whenever state changes
  const saveProjectsToStorage = (updatedList: EcoProject[]) => {
    setProjects(updatedList);
    localStorage.setItem('sustainapulse_projects', JSON.stringify(updatedList));
  };

  // Toast helper function
  const triggerToast = (message: string, type: 'success' | 'warning' | 'info') => {
    setToast({ message, type });
  };

  const handleAddProject = (newProj: Omit<EcoProject, 'id'>) => {
    const id = `proj-${Date.now()}`;
    const combined: EcoProject = { id, ...newProj };
    const updated = [combined, ...projects];
    saveProjectsToStorage(updated);
  };

  const handleUpdateProject = (updatedProj: EcoProject) => {
    const updated = projects.map(p => p.id === updatedProj.id ? updatedProj : p);
    saveProjectsToStorage(updated);
  };

  const handleDeleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    saveProjectsToStorage(updated);
  };

  return (
    <div className="relative text-ink bg-sand min-h-screen selection:bg-emerald-100 selection:text-emerald-900 antialiased">
      
      {/* View routing based on React state */}
      <AnimatePresence mode="wait">
        {activeView === 'landing' ? (
          <motion.div
            key="view-landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <LandingView 
              onEnterAdmin={() => {
                setActiveView('admin');
                triggerToast('در حال بارگذاری پنل مدیریت زیست‌مانا...', 'info');
              }} 
              triggerToast={triggerToast} 
            />
          </motion.div>
        ) : (
          <motion.div
            key="view-admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AdminView 
              projects={projects}
              onAddProject={handleAddProject}
              onUpdateProject={handleUpdateProject}
              onDeleteProject={handleDeleteProject}
              onExitAdmin={() => {
                setActiveView('landing');
                triggerToast('در حال بازگشت به سامانه عمومی زیست‌مانا...', 'info');
              }}
              triggerToast={triggerToast}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Toast component */}
      <AnimatePresence>
        {toast && (
          <NotificationToast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
