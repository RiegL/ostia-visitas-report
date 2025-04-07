import { supabase } from "@/integrations/supabase/client";
import { Patient, PatientStatus } from "@/types";
import { v4 as uuidv4 } from "uuid";

type PatientInput = Omit<Patient, "id" | "createdAt" | "updatedAt">;
type PatientUpdate = Partial<Omit<Patient, "id" | "createdAt" | "updatedAt">>;

export const patientService = {
  getAll: async (): Promise<Patient[]> => {
    const { data, error } = await supabase.from("patients").select("*");

    if (error) {
      console.error("Erro ao buscar pacientes:", error);
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
    }));
  },

  getById: async (id: string): Promise<Patient | null> => {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      console.error("Erro ao buscar paciente:", error);
      throw error;
    }

    if (!data) return null;

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
    };
  
    const { data, error } = await supabase
      .from("patients")
      .insert([newPatient]) // ⚠️ importante usar array aqui
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
    };

    const { data, error } = await supabase
      .from("patients")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar paciente:", error);
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
    };
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from("patients").delete().eq("id", id);

    if (error) {
      console.error("Erro ao excluir paciente:", error);
      throw error;
    }
  },
};
