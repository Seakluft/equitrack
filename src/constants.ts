import type { Discipline } from './types';

export const INTENSITIES: Record<Discipline, number> = {
  Jumping: 5.0,
  Dressage: 3.5,
  Flatwork: 3.0,
  Trail: 2.5,
  Vaulting: 4.5,
  Other: 3.0,
};

export const DEFAULT_HORSES = [
  { id: 'h1', name: 'Thunder', iconUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063125.png' },
  { id: 'h2', name: 'Goldie', iconUrl: 'https://cdn-icons-png.flaticon.com/512/3063/3063111.png' },
];

export const DEFAULT_SETTINGS = {
  licensePrice: 36, // Standard license in FR
  forfaitPrice: 450, // Seasonal package
  zone: 'Zone B',
  seasonStart: '2025-09-01',
  seasonEnd: '2026-06-30',
  weight: 60, // Standard weight for calorie calc (can be adjustable)
};
