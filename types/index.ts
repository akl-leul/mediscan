export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  date_of_birth: string | null;
  gender: string;
  medical_conditions: string[];
  allergies: string[];
  emergency_contact_name: string;
  emergency_contact_phone: string;
  created_at: string;
  updated_at: string;
}

export interface ScanResult {
  id: string;
  user_id: string;
  image_url: string;
  medicine_name: string;
  description: string;
  uses: string;
  side_effects: string;
  dosage: string;
  created_at: string;
}

export interface DiagnosisResult {
  id: string;
  user_id: string;
  symptoms: string;
  diet: string;
  location: string;
  possible_diseases: Disease[];
  recommendations: string;
  created_at: string;
}

export interface Disease {
  name: string;
  probability: number;
  description: string;
}

export interface ThemeMode {
  mode: 'light' | 'dark' | 'system';
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}