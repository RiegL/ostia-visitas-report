
import { supabase } from "@/integrations/supabase/client";
import { Minister } from "@/types";

export const ministerService = {
  // Buscar todos os ministros
  getAll: async (): Promise<Minister[]> => {
    const { data, error } = await supabase
      .from('minister')
      .select('*');
    
    if (error) {
      console.error('Erro ao buscar ministros:', error);
      throw error;
    }

    return (data || []).map((patient) => ({
      id: patient.id,
      name: patient.name,
      address: patient.address || "",
      district: patient.district || "",
      phones: Array.isArray(patient.phones)
        ? patient.phones
        : patient.phones
        ? [patient.phones]
        : [],
      status: (patient.status as PatientStatus) || "active",
      createdAt: patient.created_at || new Date().toISOString(),
      updatedAt: patient.update_at || new Date().toISOString(),
      observations: patient.observations || "",
    }));
  },
  
  // Autenticar um ministro
  authenticate: async (username: string, password: string): Promise<Minister | null> => {
    // Buscar ministro pelo nome de usuário
    console.log("Tentando logar com:", { username, password });
    const { data, error } = await supabase
      .from('minister')
      .select('*')
      .eq('username', username)
      .eq('password', password) // Nota: Em produção, use hash de senha!
      .single();
    
    if (error || !data) {
      console.error('Erro de autenticação:', error);
      return null;
    }
    
    // Atualizar último login
    await supabase
      .from('minister')
      .update({ lastLogin: new Date().toISOString() })
      .eq('id', data.id);
    return {
      id: data.id,
      name: data.name,
      address: data.address || "",
      district: data.district || "",
      phones: Array.isArray(data.phones)
        ? data.phones
        : data.phones
        ? [data.phones]
        : [],
      status: (data.status as PatientStatus) || "active",
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.update_at || new Date().toISOString(),
      observations: data.observations || "",
    };
  },

  create: async (patientData: PatientInput): Promise<Patient> => {
    const now = new Date().toISOString();
    const newPatient = {
      id: uuidv4(),
      name: patientData.name,
      address: patientData.address,
      district: patientData.district,
      phones: patientData.phones, // <- deve ser string[]
      status: patientData.status || "active",
      created_at: now,
      update_at: now,
      observations: patientData.observations || "",
    };
  
    const { data, error } = await supabase
      .from("patients")
      .insert([newPatient]) 
      .select()
      .single();
  
    if (error) {
      console.error("Erro ao criar paciente:", error);
      throw error;
    }
  
    return {
      id: data.id,
      name: data.name,
      address: data.address || "",
      district: data.district || "",
      phones: Array.isArray(data.phones)
        ? data.phones
        : data.phones
        ? [data.phones]
        : [],
      status: (data.status as PatientStatus) || "active",
      createdAt: data.created_at,
      updatedAt: data.update_at,
      observations: data.observations || "",
    };
  },
  

  update: async (id: string, patientData: PatientUpdate): Promise<Patient> => {
    const updateData = {
      ...(patientData.name && { name: patientData.name }),
      ...(patientData.address && { address: patientData.address }),
      ...(patientData.district && { district: patientData.district }),
      ...(patientData.phones && { phones: patientData.phones }),
      ...(patientData.status && { status: patientData.status }),
      update_at: new Date().toISOString(),
      ...(patientData.observations && { observations: patientData.observations }),
    };

    const { data, error } = await supabase
      .from("patients")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error || !updated) {
      console.error("Erro ao atualizar ministro:", error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      address: data.address || "",
      district: data.district || "",
      phones: Array.isArray(data.phones)
        ? data.phones
        : data.phones
        ? [data.phones]
        : [],
      status: (data.status as PatientStatus) || "active",
      createdAt: data.created_at,
      updatedAt: data.update_at,
      observations: data.observations || "",
    };
  },

  // Deletar ministro por ID
  delete: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('minister')
      .delete()
      .eq('id', id);
  
    if (error) {
      console.error("Erro ao deletar ministro:", error);
      throw error;
    }
  },
  

};
