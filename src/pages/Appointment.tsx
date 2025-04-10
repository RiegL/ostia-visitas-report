import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Input } from "@/components/ui/input";
import { Search, Phone, User } from "lucide-react";

import { Patient } from "@/types";
import { appointmentService } from "@/services/appointmentService";

const Appointment = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: patients, isLoading } = useQuery({
    queryKey: ["active-patients"],
    queryFn: appointmentService.getActivePatients,
  });

  const filteredPatients = patients?.filter((patient) => {
    const query = searchQuery.toLowerCase();
    return (
      patient.name.toLowerCase().includes(query) ||
      patient.district.toLowerCase().includes(query) ||
      patient.phones.some((phone: string) => phone.includes(query))
    );
  }) || [];

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

      {isLoading ? (
        <div className="text-center">Carregando doentes...</div>
      ) : filteredPatients.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <User className="mb-2 h-10 w-10 text-muted-foreground" />
            <h3 className="text-lg font-medium">Nenhum doente ativo encontrado</h3>
            <p className="text-sm text-muted-foreground">
              Verifique se há doentes cadastrados com status "ativo".
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPatients.map((patient: Patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onClick={() => navigate(`/appointments/schedule/${patient.id}`)}
            />
          ))}
        </div>
      )}
    </Layout>
  );
};

const PatientCard = ({
  patient,
  onClick,
}: {
  patient: Patient;
  onClick: () => void;
}) => {
  return (
    <Card className="overflow-hidden cursor-pointer" onClick={onClick}>
      <CardContent className="p-4 hover:bg-muted/50 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{patient.name}</h3>
              <StatusBadge status={patient.status} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{patient.address}</p>
            <p className="text-sm text-muted-foreground">Setor: {patient.district}</p>
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
