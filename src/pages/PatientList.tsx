
import { useState } from "react";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, User, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useQuery } from "@tanstack/react-query";
import { patientService } from "@/services/mockData";
import { Patient, PatientStatus } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PatientList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: patients, isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: patientService.getAll,
  });

  const filteredPatients = patients
    ? patients
        .filter((patient) => {
          // Apply status filter
          if (statusFilter !== "all") {
            return patient.status === statusFilter;
          }
          return true;
        })
        .filter((patient) => {
          // Apply search filter (case insensitive)
          const query = searchQuery.toLowerCase();
          return (
            patient.name.toLowerCase().includes(query) ||
            patient.district.toLowerCase().includes(query) ||
            patient.phones.some((phone) => phone.includes(query))
          );
        })
    : [];

  return (
    <Layout>
      <PageHeader 
        title="Pacientes" 
        subtitle="Gerencie a lista de pacientes para visitas"
      >
        <Button asChild className="bg-pastoral-400 hover:bg-pastoral-500">
          <Link to="/patients/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Paciente
          </Link>
        </Button>
      </PageHeader>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, bairro ou telefone..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="recovered">Recuperados</SelectItem>
            <SelectItem value="deceased">Falecidos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center">Carregando pacientes...</div>
      ) : filteredPatients.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <User className="mb-2 h-10 w-10 text-muted-foreground" />
            <h3 className="text-lg font-medium">Nenhum paciente encontrado</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery || statusFilter !== "all"
                ? "Tente ajustar os filtros de busca"
                : "Comece adicionando um novo paciente"}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Button
                asChild
                variant="outline"
                className="mt-4"
              >
                <Link to="/patients/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Paciente
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      )}
    </Layout>
  );
};

const PatientCard = ({ patient }: { patient: Patient }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Link
          to={`/patients/${patient.id}`}
          className="block p-4 transition-colors hover:bg-muted/50"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{patient.name}</h3>
                <StatusBadge status={patient.status} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{patient.address}</p>
              <p className="text-sm text-muted-foreground">Bairro: {patient.district}</p>
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
        </Link>
      </CardContent>
    </Card>
  );
};

export default PatientList;
