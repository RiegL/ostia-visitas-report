import { supabase } from "@/integrations/supabase/client";
import { Appointment, AppointmentInput, Patient, PatientStatus } from "@/types";

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

  async scheduleVisit(input: AppointmentInput): Promise<Appointment> {
    // Insere o agendamento na tabela "appointments" do Supabase
    const insertData = {
      patient_id: input.patientId,
      minister_id: input.ministerId,
      minister_name: input.minister_name,
      date: input.date,
      notes: input.notes,
    };
    const { data, error } = await supabase
      .from("appointments")
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error("Erro ao agendar visita:", error);
      throw error;
    }

    // Mapeamento dos campos do banco (snake_case) para o nosso tipo (camelCase)
    return {
      id: data.id,
      patientId: data.patient_id,
      ministerId: data.minister_id,
      minister_name: data.minister_name,
      date: data.date,
      notes: data.notes ?? "",
      createdAt: data.created_at,
    };
  },

  // Aqui você pode adicionar outros métodos, por exemplo, para buscar os agendamentos de um dia
  async getAppointmentsByDate(dateStr: string): Promise<Appointment[]> {
    // Exemplo: busca todos os agendamentos cuja data (apenas a parte da data) bate com o informado
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("date", dateStr);

    if (error) throw error;

    return data.map((a: any) => ({
      id: a.id,
      patientId: a.patient_id,
      ministerId: a.minister_id,
      minister_name: a.minister_name,
      date: a.date,
      notes: a.notes ?? "",
      createdAt: a.created_at,
    }));
  },
  async cancelVisit({ patientId, ministerId }: { patientId: string; ministerId: number }) {
    // Deleta o agendamento da tabela "appointments" usando os parâmetros
    const { data, error } = await supabase
      .from("appointments")
      .delete()
      .eq("patient_id", patientId) // Verifica o paciente
      .eq("minister_id", ministerId); // Verifica o ministro (se necessário)

    if (error) {
      console.error("Erro ao cancelar visita:", error);
      throw error;
    }

    // Se não houver erro, retorna uma mensagem de sucesso ou apenas confirma a exclusão
    return { success: true, message: "Visita desmarcada com sucesso" };
  },
};
