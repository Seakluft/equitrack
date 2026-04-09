import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { INTENSITIES } from '../constants';
import styles from './StatsView.module.css';
import { isWithinInterval, parseISO, startOfYear, endOfYear } from 'date-fns';

const StatsView: React.FC = () => {
  const { lessons, horses, settings } = useApp();
  const [filterHorse, setFilterHorse] = useState('');
  const [filterDiscipline, setFilterDiscipline] = useState('');
  const [timeRange, setTimeRange] = useState('year'); // 'all', 'year', 'month'

  const filteredLessons = useMemo(() => {
    return lessons.filter((l) => {
      if (!l.isPresent) return false;
      if (filterHorse && l.horseId !== filterHorse) return false;
      if (filterDiscipline && l.discipline !== filterDiscipline) return false;
      
      if (timeRange === 'year') {
        const now = new Date();
        return isWithinInterval(parseISO(l.date), {
          start: startOfYear(now),
          end: endOfYear(now),
        });
      }
      return true;
    });
  }, [lessons, filterHorse, filterDiscipline, timeRange]);

  const stats = useMemo(() => {
    const totalSessions = filteredLessons.length;
    const totalDuration = filteredLessons.reduce((acc, l) => acc + l.duration, 0);
    const totalCalories = filteredLessons.reduce((acc, l) => {
      const met = l.discipline ? INTENSITIES[l.discipline] : 3.0;
      return acc + (l.duration * met * 60) / 60; // Simplified: met * duration * (60kg / 60)
    }, 0);

    const horseCounts: Record<string, number> = {};
    const disciplineCounts: Record<string, number> = {};

    filteredLessons.forEach((l) => {
      if (l.horseId) horseCounts[l.horseId] = (horseCounts[l.horseId] || 0) + 1;
      if (l.discipline) disciplineCounts[l.discipline] = (disciplineCounts[l.discipline] || 0) + 1;
    });

    const totalCost = settings.licensePrice + settings.forfaitPrice;
    const attendedInTotal = lessons.filter(l => l.isPresent).length;
    const costPerSession = attendedInTotal > 0 ? (totalCost / attendedInTotal).toFixed(2) : 0;

    return { totalSessions, totalDuration, totalCalories, horseCounts, disciplineCounts, costPerSession };
  }, [filteredLessons, lessons, settings]);

  return (
    <div className={styles.container}>
      <h2>Statistiques</h2>
      
      <div className={styles.filters}>
        <select value={filterHorse} onChange={(e) => setFilterHorse(e.target.value)}>
          <option value="">Tous les chevaux</option>
          {horses.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
        </select>
        
        <select value={filterDiscipline} onChange={(e) => setFilterDiscipline(e.target.value)}>
          <option value="">Toutes les disciplines</option>
          {Object.keys(INTENSITIES).map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option value="all">Tout le temps</option>
          <option value="year">Cette année</option>
        </select>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>Séances</h3>
          <p className={styles.value}>{stats.totalSessions}</p>
        </div>
        <div className={styles.card}>
          <h3>Calories (est.)</h3>
          <p className={styles.value}>{Math.round(stats.totalCalories)} kcal</p>
        </div>
        <div className={styles.card}>
          <h3>Coût / séance</h3>
          <p className={styles.value}>{stats.costPerSession} €</p>
        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.list}>
          <h4>Par cheval</h4>
          {Object.entries(stats.horseCounts).map(([id, count]) => {
            const horse = horses.find(h => h.id === id);
            return <div key={id}>{horse?.name}: {count} fois</div>;
          })}
        </div>
        <div className={styles.list}>
          <h4>Par discipline</h4>
          {Object.entries(stats.disciplineCounts).map(([d, count]) => (
            <div key={d}>{d}: {count} fois</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsView;
