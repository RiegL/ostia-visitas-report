import { Patient, Minister } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Mock data for patients
let patients: Patient[] = [
  {
    id: "1",
    name: "Maria da Silva",
    address: "Rua das Flores, 123",
    district: "Centro",
    phones: ["1234-5678", "8765-4321", "9999-8888"],
    status: "active",
    createdAt: new Date(2023, 0, 15).toISOString(),
    updatedAt: new Date(2023, 0, 15).toISOString(),
  },
  {
    id: "2",
    name: "João Oliveira",
    address: "Av. Principal, 456",
    district: "Vila Nova",
    phones: ["5555-1234", "7777-8888"],
    status: "active",
    createdAt: new Date(2023, 1, 20).toISOString(),
    updatedAt: new Date(2023, 1, 20).toISOString(),
  },
  {
    id: "3",
    name: "Ana Pereira",
    address: "Rua São Pedro, 789",
    district: "Jardim",
    phones: ["3333-2222"],
    status: "recovered",
    createdAt: new Date(2023, 2, 10).toISOString(),
    updatedAt: new Date(2023, 3, 15).toISOString(),
  },
  {
    id: "4",
    name: "Carlos Santos",
    address: "Av. Dom Pedro, 321",
    district: "Santa Rita",
    phones: ["9876-5432", "1111-2222", "4444-3333"],
    status: "deceased",
    createdAt: new Date(2023, 3, 5).toISOString(),
    updatedAt: new Date(2023, 4, 10).toISOString(),
  },
];

// Mock data for ministers
let ministers: Minister[] = [
  {
    id: "1",
    name: "Pedro Alves",
    phone: "9999-1111",
    username: "pedro",
    password: "123456",
  },
  {
    id: "2",
    name: "Marta Souza",
    phone: "8888-2222",
    username: "marta",
    password: "123456",
  },
];

// Patient service
export const patientService = {
  getAll: () => Promise.resolve([...patients]),
  
  getById: (id: string) => {
    const patient = patients.find(p => p.id === id);
    return Promise.resolve(patient ? { ...patient } : null);
  },
  
  getByStatus: (status: string) => {
    const filteredPatients = patients.filter(p => p.status === status);
    return Promise.resolve([...filteredPatients]);
  },
  
  create: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPatient: Patient = {
      ...patient,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    patients.push(newPatient);
    return Promise.resolve({ ...newPatient });
  },
  
  update: (id: string, updates: Partial<Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const index = patients.findIndex(p => p.id === id);
    if (index === -1) return Promise.resolve(null);
    
    patients[index] = {
      ...patients[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    return Promise.resolve({ ...patients[index] });
  },
  
  delete: (id: string) => {
    const index = patients.findIndex(p => p.id === id);
    if (index === -1) return Promise.resolve(false);
    
    patients.splice(index, 1);
    return Promise.resolve(true);
  },
};

// Minister service
export const ministerService = {
  getAll: () => Promise.resolve([...ministers]),
  
  getById: (id: string) => {
    const minister = ministers.find(m => m.id === id);
    return Promise.resolve(minister ? { ...minister } : null);
  },
  
  create: (minister: Omit<Minister, 'id'>) => {
    const newMinister: Minister = {
      ...minister,
      id: uuidv4(),
    };
    
    ministers.push(newMinister);
    return Promise.resolve({ ...newMinister });
  },
  
  update: (id: string, updates: Partial<Omit<Minister, 'id'>>) => {
    const index = ministers.findIndex(m => m.id === id);
    if (index === -1) return Promise.resolve(null);
    
    ministers[index] = {
      ...ministers[index],
      ...updates,
    };
    
    return Promise.resolve({ ...ministers[index] });
  },
  
  delete: (id: string) => {
    const index = ministers.findIndex(m => m.id === id);
    if (index === -1) return Promise.resolve(false);
    
    ministers.splice(index, 1);
    return Promise.resolve(true);
  },
  
  authenticate: (username: string, password: string) => {
    const minister = ministers.find(m => m.username === username && m.password === password);
    return Promise.resolve(minister || null);
  }
};
