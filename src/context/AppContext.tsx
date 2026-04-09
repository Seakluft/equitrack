import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Horse, Lesson, Settings, Holiday } from '../types';
import { DEFAULT_HORSES, DEFAULT_SETTINGS } from '../constants';

interface AppContextType {
  horses: Horse[];
  lessons: Lesson[];
  settings: Settings;
  holidays: Holiday[];
  isLoading: boolean;
  addLesson: (lesson: Lesson) => void;
  updateLesson: (lesson: Lesson) => void;
  updateSettings: (settings: Settings) => void;
  addHorse: (horse: Horse) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [horses, setHorses] = useState<Horse[]>(() => {
    const saved = localStorage.getItem('equitrack_horses');
    return saved ? JSON.parse(saved) : DEFAULT_HORSES;
  });

  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const saved = localStorage.getItem('equitrack_lessons');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('equitrack_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem('equitrack_horses', JSON.stringify(horses));
  }, [horses]);

  useEffect(() => {
    localStorage.setItem('equitrack_lessons', JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem('equitrack_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const zoneEnc = encodeURIComponent(settings.zone);
        const url = `https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-calendrier-scolaire/records?where=zones%3D%22${zoneEnc}%22&limit=100`;
        const response = await fetch(url);
        const data = await response.json();
        
        // Map API response to our Holiday interface
        const mapped = data.results
          .filter((r: any) => r.population === 'Élèves')
          .map((r: any) => ({
            description: r.description,
            start_date: r.start_date,
            end_date: r.end_date,
          }));
        setHolidays(mapped);
      } catch (error) {
        console.error('Failed to fetch holidays:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHolidays();
  }, [settings.zone]);

  const addLesson = (lesson: Lesson) => {
    setLessons((prev) => [...prev.filter((l) => l.date !== lesson.date), lesson]);
  };

  const updateLesson = (lesson: Lesson) => {
    setLessons((prev) => prev.map((l) => (l.id === lesson.id ? lesson : l)));
  };

  const updateSettings = (newSettings: Settings) => setSettings(newSettings);
  const addHorse = (horse: Horse) => setHorses((prev) => [...prev, horse]);

  return (
    <AppContext.Provider
      value={{
        horses,
        lessons,
        settings,
        holidays,
        isLoading,
        addLesson,
        updateLesson,
        updateSettings,
        addHorse,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
