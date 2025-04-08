
import { supabase } from "@/integrations/supabase/client";
import { Patient, PatientStatus } from "@/types";
import { v4 as uuidv4 } from "uuid";

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
    
    return (data || []).map(patient => ({
      id: patient.id,
      name: patient.name,
      // Lidar com o fato de que address não existe no banco, usando distric como substituto
      address: patient.address || patient.distric || '',
      district: patient.district || patient.distric || '',
      // Converter phones de string para array de strings se necessário
      phones: Array.isArray(patient.phones) ? patient.phones : 
        (typeof patient.phones === 'string' ? [patient.phones] : []),
      status: (patient.status as PatientStatus) || 'active',
      createdAt: patient.created_at || new Date().toISOString(),
      updatedAt: patient.update_at || new Date().toISOString()
    }));
  },
  
  // Buscar um paciente pelo ID
  getById: async (id: string): Promise<Patient | null> => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Erro ao buscar paciente com ID ${id}:`, error);
      return null;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      address: data.address || data.distric || '',
      district: data.district || data.distric || '',
      phones: Array.isArray(data.phones) ? data.phones : 
        (typeof data.phones === 'string' ? [data.phones] : []),
      status: (data.status as PatientStatus) || 'active',
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.update_at || new Date().toISOString()
    };
  },
  
  // Criar um novo paciente
  create: async (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Patient> => {
    const now = new Date().toISOString();
    const newPatient = {
      id: uuidv4(),
      ...patient,
      // Usar distric em vez de address já que o campo no banco é distric
      distric: patient.district || patient.address, // mapeando para o campo correto no banco
      // Converter array de telefones para string se necessário
      phones: patient.phones,
      status: patient.status || 'active',
      created_at: now,
      update_at: now
    };
    
    const { data, error } = await supabase
      .from('patients')
      .insert({
        name: newPatient.name,
        distric: newPatient.distric,
        // Remover o campo address já que não existe no banco
        phones: newPatient.phones,
        status: newPatient.status,
        created_at: newPatient.created_at,
        update_at: newPatient.update_at
      })
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar paciente:', error);
      throw error;
    }
    
    return {
      id: data?.id || newPatient.id,
      name: data?.name || newPatient.name,
      address: data?.address || data?.distric || newPatient.distric || '',
      district: data?.district || data?.distric || newPatient.distric || '',
      phones: Array.isArray(data?.phones) ? data.phones : 
        (typeof data?.phones === 'string' ? [data.phones] : newPatient.phones),
      status: (data?.status as PatientStatus) || newPatient.status,
      createdAt: data?.created_at || newPatient.created_at,
      updatedAt: data?.update_at || newPatient.update_at
    };
  },
  
  // Atualizar um paciente existente
  update: async (id: string, updates: Partial<Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Patient> => {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('patients')
      .update({
        name: updates.name,
        distric: updates.district || updates.address, // mapeando para o campo correto no banco
        // Não incluir address pois não existe no banco
        phones: updates.phones,
        status: updates.status,
        update_at: now
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Erro ao atualizar paciente com ID ${id}:`, error);
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      address: data.address || data.distric || '',
      district: data.district || data.distric || '',
      phones: Array.isArray(data.phones) ? data.phones : 
        (typeof data.phones === 'string' ? [data.phones] : []),
      status: (data.status as PatientStatus) || 'active',
      createdAt: data.created_at || now,
      updatedAt: data.update_at || now
    };
  },
  
  // Excluir um paciente
  delete: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Erro ao excluir paciente com ID ${id}:`, error);
      throw error;
    }
    
    return true;
  }
};
