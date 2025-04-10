import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useContext } from "react";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Input } from "@/components/ui/input";
import { Search, Phone, User } from "lucide-react";

import { Patient } from "@/types";
import { appointmentService } from "@/services/appointmentService";
import { AuthContext } from "@/contexts/AuthContext"; // contexto do usuário logado
import { ConfirmDialog } from "@/components/ConfirmDialog"; // Importe o seu componente ConfirmDialog
import { DatePicker } from "@/components/ui/DatePicker";

const Appointment = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { minister } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null); // Armazenar paciente selecionado
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Estado para controlar o dialog
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const { data: patients, isLoading } = useQuery({
    queryKey: ["active-patients"],
    queryFn: appointmentService.getActivePatients,
  });

  const { data: appointmentsToday = [] } = useQuery({
    queryKey: ["appointments", selectedDate],
    queryFn: () => appointmentService.getAppointmentsByDate(selectedDate),
  });

  const filteredPatients =
    patients?.filter((patient) => {
      const query = searchQuery.toLowerCase();
      return (
        patient.name.toLowerCase().includes(query) ||
        patient.district.toLowerCase().includes(query) ||
        patient.phones.some((phone: string) => phone.includes(query))
      );
    }) || [];

  const getPatientAppointment = (patientId: string) =>
    appointmentsToday.find((a) => a.patientId === patientId);

  const handleSchedule = (patient: Patient) => {
    if (getPatientAppointment(patient.id)) return;

    setSelectedPatient(patient); // Definir paciente selecionado
    setIsDialogOpen(true); // Abrir o dialog
  };

  const handleConfirmSchedule = async () => {
    if (selectedPatient) {
      await appointmentService.scheduleVisit({
        patientId: selectedPatient.id,
        ministerId: minister.id,
        minister_name: minister.name,
        date: selectedDate, // Usando a data selecionada
      });

      queryClient.invalidateQueries({
        queryKey: ["appointments", selectedDate],
      });
    }
    setIsDialogOpen(false); // Fechar o dialog após confirmar
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false); // Fechar o dialog se o usuário cancelar
  };

  return (
    <Layout>
      <PageHeader
        title="Agendar Visitas"
        subtitle="Escolha um doente ativo para agendar a visita"
      />

      <div className="mb-6 flex">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, bairro ou telefone..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-6">
      <DatePicker
  date={new Date(selectedDate)}
  onChange={(newDate: Date) => setSelectedDate(newDate.toISOString().split("T")[0])}
/>
      </div>

      {isLoading ? (
        <div className="text-center">Carregando doentes...</div>
      ) : filteredPatients.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <User className="mb-2 h-10 w-10 text-muted-foreground" />
            <h3 className="text-lg font-medium">
              Nenhum doente ativo encontrado
            </h3>
            <p className="text-sm text-muted-foreground">
              Verifique se há doentes cadastrados com status "ativo".
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPatients.map((patient: Patient) => {
            const appointment = getPatientAppointment(patient.id);
            return (
              <PatientCard
                key={patient.id}
                patient={patient}
                appointment={appointment}
                currentMinisterName={minister.name}
                onClick={() => handleSchedule(patient)}
              />
            );
          })}
        </div>
      )}

      {/* ConfirmDialog para agendar visita */}
      <ConfirmDialog
        open={isDialogOpen}
        title="Confirmar Agendamento"
        description={`Deseja agendar visita para ${selectedPatient?.name} no dia ${selectedDate}?`}
        onClose={handleDialogClose}
        onConfirm={handleConfirmSchedule}
        colorConfirmar="success"
      />
    </Layout>
  );
};

const PatientCard = ({
  patient,
  appointment,
  currentMinisterName,
  onClick,
}: {
  patient: Patient;
  appointment?: { minister_name: string };
  currentMinisterName: string;
  onClick: () => void;
}) => {
  const isScheduled = !!appointment;

  return (
    <Card
      className={`overflow-hidden cursor-pointer ${
        isScheduled ? "opacity-70" : ""
      }`}
      onClick={isScheduled ? undefined : onClick}
    >
      <CardContent className="p-4 hover:bg-muted/50 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{patient.name}</h3>
              <StatusBadge status={patient.status} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {patient.address}
            </p>
            <p className="text-sm text-muted-foreground">
              Setor: {patient.district}
            </p>
            {isScheduled && (
              <p className="mt-2 text-xs text-green-600 font-semibold">
                Ministro{" "}
                {appointment?.minister_name === currentMinisterName
                  ? `${appointment.minister_name} (você)`
                  : appointment?.minister_name}{" "}
                agendou esta visita
              </p>
            )}
          </div>
          <div className="mt-2 sm:mt-0 sm:text-right">
            <div className="flex items-center gap-1 text-sm">
              <Phone className="h-3 w-3" />
              <span>{patient.phones[0]}</span>
            </div>
            {patient.phones.length > 1 && (
              <div className="text-xs text-muted-foreground">
                +{patient.phones.length - 1} telefone(s)
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Appointment;
