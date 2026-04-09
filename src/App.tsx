import React, { useState, useMemo } from 'react';
import { useApp, AppProvider } from './context/AppContext';
import { getSaturdays, isHolidaySaturday } from './utils/dateUtils';
import SaturdayCard from './components/SaturdayCard';
import StatsView from './components/StatsView';
import { Activity as HorseIcon, BarChart, Settings as SettingsIcon } from 'lucide-react';
import './App.css';

const AppContent: React.FC = () => {
  const { settings, holidays, isLoading, updateSettings, addHorse } = useApp();
  const [activeTab, setActiveTab] = useState<'calendar' | 'stats'>('calendar');
  const [newHorseName, setNewHorseName] = useState('');
  const [newHorseIcon, setNewHorseIcon] = useState('https://cdn-icons-png.flaticon.com/512/3063/3063111.png');

  const saturdays = useMemo(() => {
    const all = getSaturdays(settings.seasonStart, settings.seasonEnd);
    return all.filter((s) => !isHolidaySaturday(s, holidays));
  }, [settings.seasonStart, settings.seasonEnd, holidays]);

  const handleAddHorse = () => {
    if (newHorseName.trim()) {
      addHorse({
        id: crypto.randomUUID(),
        name: newHorseName,
        iconUrl: newHorseIcon,
      });
      setNewHorseName('');
      setNewHorseIcon('https://cdn-icons-png.flaticon.com/512/3063/3063111.png');
    }
  };

  if (isLoading) return <div className="loading">Chargement du calendrier scolaire...</div>;

  return (
    <div className="app">
      <header>
        <h1><HorseIcon size={28} /> EquiTrack</h1>
        <nav>
          <button 
            className={activeTab === 'calendar' ? 'active' : ''} 
            onClick={() => setActiveTab('calendar')}
          >
            Calendrier
          </button>
          <button 
            className={activeTab === 'stats' ? 'active' : ''} 
            onClick={() => setActiveTab('stats')}
          >
            <BarChart size={18} /> Statistiques
          </button>
        </nav>
      </header>

      <main>
        {activeTab === 'calendar' ? (
          <div className="calendarGrid">
            {saturdays.map((s) => (
              <SaturdayCard key={s.toISOString()} date={s} />
            ))}
          </div>
        ) : (
          <StatsView />
        )}

        <div className="settings">
          <h3><SettingsIcon size={20} /> Paramètres de la saison</h3>
          <div className="settingsGroup">
            <div className="field">
              <label>Prix Licence (€)</label>
              <input 
                type="number" 
                value={settings.licensePrice} 
                onChange={(e) => updateSettings({ ...settings, licensePrice: Number(e.target.value) })}
              />
            </div>
            <div className="field">
              <label>Prix Forfait Saison (€)</label>
              <input 
                type="number" 
                value={settings.forfaitPrice} 
                onChange={(e) => updateSettings({ ...settings, forfaitPrice: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="settingsGroup" style={{ marginTop: '2rem' }}>
            <div className="field">
              <label>Ajouter un cheval</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <input 
                  style={{ width: '200px' }}
                  type="text" 
                  placeholder="Nom du cheval"
                  value={newHorseName}
                  onChange={(e) => setNewHorseName(e.target.value)}
                />
                <input 
                  style={{ width: '300px' }}
                  type="text" 
                  placeholder="URL Icône (PNG)"
                  value={newHorseIcon}
                  onChange={(e) => setNewHorseIcon(e.target.value)}
                />
                <button className="active" style={{ padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', border: 'none', color: 'white', background: 'var(--forest)' }} onClick={handleAddHorse}>Ajouter</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default App;
