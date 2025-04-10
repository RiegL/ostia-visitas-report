
export type PatientStatus = 'active' | 'recovered' | 'deceased';

export interface Patient {
  id: string;
  name: string;
  address: string;
  district: string;
  phones: string[];
  status: PatientStatus;
  createdAt: string;
  updatedAt: string;
  observations?: string;
}

export interface Minister {
  id: number;
  name: string;
  phone: string;
  email?: string;
  username: string;
  password?: string;
  role?: 'admin' | 'user';
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
  profileImage?: string;
}

export interface PatientInput {
  name: string;
  address: string;
  district: string;
  phones: string[];
  status?: PatientStatus;
  observations?: string;
}

export interface PatientUpdate {
  name?: string;
  address?: string;
  district?: string;
  phones?: string[];
  status?: PatientStatus;
  observations?: string;
}

export interface AuthContext {
  minister: Minister | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

export interface Appointment {
  id: number;            // Será um bigint auto-incremental no Supabase
  patientId: string;     // Referência ao paciente (UUID)
  ministerId: number;    // Referência ao ministro (int8)
  minister_name: string;  // Nome do ministro (string)
  date: string;          // Data/hora do agendamento (em formato ISO, por exemplo)
  notes?: string;        // Observações da visita (opcional)
  createdAt: string;     // Data de criação
}

export interface AppointmentInput {
  patientId: string;
  ministerId: number;
  minister_name: string;
  date: string;
  notes?: string;
}
