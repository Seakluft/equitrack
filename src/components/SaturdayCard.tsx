import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useApp } from '../context/AppContext';
import type { Lesson, Discipline } from '../types';
import styles from './SaturdayCard.module.css';

import { INTENSITIES } from '../constants';

interface SaturdayCardProps {
  date: Date;
}

const DISCIPLINE_ICONS: Record<Discipline, string> = {
  Jumping: 'https://cdn-icons-png.flaticon.com/512/3063/3063125.png', // Placeholder
  Dressage: 'https://cdn-icons-png.flaticon.com/512/3063/3063111.png',
  Flatwork: 'https://cdn-icons-png.flaticon.com/512/3063/3063120.png',
  Trail: 'https://cdn-icons-png.flaticon.com/512/3063/3063130.png',
  Vaulting: 'https://cdn-icons-png.flaticon.com/512/3063/3063140.png',
  Other: 'https://cdn-icons-png.flaticon.com/512/3063/3063150.png',
};

const SaturdayCard: React.FC<SaturdayCardProps> = ({ date }) => {
  const { lessons, horses, addLesson } = useApp();
  const dateStr = format(date, 'yyyy-MM-dd');
  const lesson = lessons.find((l) => l.date === dateStr);

  const togglePresence = () => {
    if (lesson) {
      addLesson({ ...lesson, isPresent: !lesson.isPresent });
    } else {
      addLesson({
        id: crypto.randomUUID(),
        date: dateStr,
        isPresent: true,
        duration: 60,
        discipline: 'Flatwork',
      });
    }
  };

  const updateLesson = (updates: Partial<Lesson>) => {
    if (lesson) {
      addLesson({ ...lesson, ...updates });
    }
  };

  const currentHorse = horses.find((h) => h.id === lesson?.horseId);

  return (
    <div className={`${styles.card} ${lesson && !lesson.isPresent ? styles.cardAbsent : ''}`}>
      <div className={styles.date}>{format(date, 'd MMM yyyy', { locale: fr })}</div>

      <button className={styles.toggle} onClick={togglePresence}>
        {lesson?.isPresent ? 'Présent' : 'Absent/Inactif'}
      </button>

      {lesson?.isPresent && (
        <div className={styles.form}>
          <div className={styles.icons}>
            {lesson.discipline && (
              <img
                src={DISCIPLINE_ICONS[lesson.discipline]}
                className={styles.icon}
                alt={lesson.discipline}
                title={lesson.discipline}
              />
            )}
            {currentHorse?.iconUrl && (
              <img src={currentHorse.iconUrl} className={styles.icon} alt={currentHorse.name} />
            )}
          </div>
          
          {currentHorse && <span className={styles.horseName}>{currentHorse.name}</span>}

          <select
            className={styles.select}
            value={lesson.horseId || ''}
            onChange={(e) => updateLesson({ horseId: e.target.value })}
          >
            <option value="">Choisir un cheval</option>
            {horses.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>

          <select
            className={styles.select}
            value={lesson.discipline || ''}
            onChange={(e) => updateLesson({ discipline: e.target.value as Discipline })}
          >
            {Object.keys(INTENSITIES).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default SaturdayCard;
