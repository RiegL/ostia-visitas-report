
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
}

export interface Minister {
  id: string;
  name: string;
  phone: string;
  email?: string;
  username: string;
  password?: string;
  role?: 'admin' | 'minister';
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
  profileImage?: string;
}

export interface AuthContext {
  minister: Minister | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}
