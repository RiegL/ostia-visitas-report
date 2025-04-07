
import { supabase } from "@/integrations/supabase/client";
import { Patient, PatientStatus } from "@/types";
import { v4 as uuidv4 } from 'uuid';

// Interface para criar/atualizar pacientes
type PatientInput = Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>;
type PatientUpdate = Partial<Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>>;

// Serviço de pacientes usando Supabase
export const patientService = {
  // Buscar todos os pacientes
  getAll: async (): Promise<Patient[]> => {
    const { data, error } = await supabase
      .from('patients')
      .select('*');
    
    if (error) {
      console.error('Erro ao buscar pacientes:', error);
      throw error;
    }
    
    // Converter o formato dos dados para o esperado pela aplicação
    return (data || []).map(patient => ({
      id: patient.id,
      name: patient.name,
      address: patient.address || '',
      district: patient.distric || '', // Observe que há um erro de digitação na coluna do banco de dados
      phones: Array.isArray(patient.phones) ? patient.phones : (patient.phones ? [patient.phones] : []),
      status: (patient.status as PatientStatus) || 'active',
      createdAt: patient.created_at || new Date().toISOString(),
      updatedAt: patient.update_at || new Date().toISOString()
    }));
  },
  
  // Buscar paciente por ID
  getById: async (id: string): Promise<Patient | null> => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // Código de erro "não encontrado"
        return null;
      }
      console.error('Erro ao buscar paciente:', error);
      throw error;
    }
    
    if (!data) return null;
    
    // Converter o formato dos dados
    return {
      id: data.id,
      name: data.name,
      address: data.address || '',
      district: data.distric || '', // Observe que há um erro de digitação na coluna
      phones: Array.isArray(data.phones) ? data.phones : (data.phones ? [data.phones] : []),
      status: (data.status as PatientStatus) || 'active',
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.update_at || new Date().toISOString()
    };
  },
  
  // Criar um novo paciente
  create: async (patientData: PatientInput): Promise<Patient> => {
    const now = new Date().toISOString();
    const newPatient = {
      id: uuidv4(),
      name: patientData.name,
      address: patientData.address,
      distric: patientData.district, // Observe a diferença no nome da coluna
      phones: patientData.phones,
      status: patientData.status || 'active',
      created_at: now,
      update_at: now
    };
    
    const { data, error } = await supabase
      .from('patients')
      .insert(newPatient)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar paciente:', error);
      throw error;
    }
    
    // Retorna o paciente no formato esperado pela aplicação
    return {
      id: data.id,
      name: data.name,
      address: data.address || '',
      district: data.distric || '',
      phones: Array.isArray(data.phones) ? data.phones : (data.phones ? [data.phones] : []),
      status: (data.status as PatientStatus) || 'active',
      createdAt: data.created_at,
      updatedAt: data.update_at
    };
  },
  
  // Atualizar um paciente existente
  update: async (id: string, patientData: PatientUpdate): Promise<Patient> => {
    const updateData = {
      ...(patientData.name && { name: patientData.name }),
      ...(patientData.address && { address: patientData.address }),
      ...(patientData.district && { distric: patientData.district }), // Observe a diferença no nome da coluna
      ...(patientData.phones && { phones: patientData.phones }),
      ...(patientData.status && { status: patientData.status }),
      update_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('patients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao atualizar paciente:', error);
      throw error;
    }
    
    // Retorna o paciente atualizado no formato esperado
    return {
      id: data.id,
      name: data.name,
      address: data.address || '',
      district: data.distric || '',
      phones: Array.isArray(data.phones) ? data.phones : (data.phones ? [data.phones] : []),
      status: (data.status as PatientStatus) || 'active',
      createdAt: data.created_at,
      updatedAt: data.update_at
    };
  },
  
  // Excluir um paciente
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao excluir paciente:', error);
      throw error;
    }
  }
};
