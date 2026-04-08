export interface Horse {
  id: string;
  name: string;
  iconUrl?: string; // PNG path or data URI
}

export type Discipline = 'Jumping' | 'Dressage' | 'Flatwork' | 'Trail' | 'Vaulting' | 'Other';

export interface Lesson {
  id: string;
  date: string; // ISO format (YYYY-MM-DD)
  isPresent: boolean;
  horseId?: string;
  discipline?: Discipline;
  notes?: string;
  duration: number; // minutes
}

export interface Settings {
  licensePrice: number;
  forfaitPrice: number;
  zone: string; // Default 'Zone B'
  seasonStart: string; // ISO format (e.g., '2025-09-01')
  seasonEnd: string; // ISO format (e.g., '2026-06-30')
}

export interface Holiday {
  description: string;
  start_date: string;
  end_date: string;
}
