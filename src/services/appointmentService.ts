
import { supabase } from "@/integrations/supabase/client";
import { Patient, PatientStatus } from "@/types";

export const appointmentService = {
  async getActivePatients(): Promise<Patient[]> {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("status", "active");

    if (error) throw error;

    return data.map((p) => ({
      id: p.id,
      name: p.name,
      address: p.address,
      district: p.district,
      phones: p.phones,
      status: p.status as PatientStatus,
      createdAt: p.created_at,
      updatedAt: p.update_at,
      observations: p.observations ?? "",
    }));
  },
};
