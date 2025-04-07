
import { useState } from "react";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { patientService } from "@/services/mockData";
import { StatusBadge } from "@/components/ui/status-badge";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { FileText, Printer, Download } from "lucide-react";

const Reports = () => {
  const [reportType, setReportType] = useState<string>("active");
  
  const { data: patients, isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: patientService.getAll,
  });
  
  const getFilteredPatients = () => {
    if (!patients) return [];
    
    switch (reportType) {
      case "active":
        return patients.filter(p => p.status === "active");
      case "recovered":
        return patients.filter(p => p.status === "recovered");
      case "deceased":
        return patients.filter(p => p.status === "deceased");
      case "byDistrict":
        // Sort by district
        return [...patients].sort((a, b) => a.district.localeCompare(b.district));
      case "all":
      default:
        return patients;
    }
  };
  
  const filteredPatients = getFilteredPatients();
  
  const getReportTitle = () => {
    switch (reportType) {
      case "active":
        return "Pacientes Ativos";
      case "recovered":
        return "Pacientes Recuperados";
      case "deceased":
        return "Pacientes Falecidos";
      case "byDistrict":
        return "Pacientes por Bairro";
      case "all":
      default:
        return "Todos os Pacientes";
    }
  };
  
  const printReport = () => {
    window.print();
  };
  
  return (
    <Layout>
      <div className="print:hidden">
        <PageHeader 
          title="Relatórios" 
          subtitle="Visualize relatórios de pacientes por categoria"
        >
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={printReport}
              className="flex items-center"
            >
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
          </div>
        </PageHeader>
        
        <div className="mb-6">
          <Select
            value={reportType}
            onValueChange={setReportType}
          >
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Selecione o tipo de relatório" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Pacientes Ativos</SelectItem>
              <SelectItem value="recovered">Pacientes Recuperados</SelectItem>
              <SelectItem value="deceased">Pacientes Falecidos</SelectItem>
              <SelectItem value="byDistrict">Pacientes por Bairro</SelectItem>
              <SelectItem value="all">Todos os Pacientes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card className="overflow-hidden print:border-none print:shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 print:hidden" />
              Relatório: {getReportTitle()}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Total: {filteredPatients.length} paciente(s)
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {format(new Date(), "PPP", { locale: ptBR })}
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">Carregando dados...</div>
          ) : filteredPatients.length === 0 ? (
            <div className="py-8 text-center">
              <p>Nenhum paciente encontrado para este relatório.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b text-left">
                    <th className="px-4 py-2 font-medium">Nome</th>
                    <th className="px-4 py-2 font-medium">Bairro</th>
                    <th className="px-4 py-2 font-medium">Endereço</th>
                    <th className="px-4 py-2 font-medium">Telefone</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reportType === "byDistrict" 
                    ? renderPatientsByDistrict(filteredPatients) 
                    : filteredPatients.map((patient) => (
                    <tr key={patient.id} className="border-b">
                      <td className="px-4 py-2">{patient.name}</td>
                      <td className="px-4 py-2">{patient.district}</td>
                      <td className="px-4 py-2">{patient.address}</td>
                      <td className="px-4 py-2">{patient.phones[0]}</td>
                      <td className="px-4 py-2">
                        <StatusBadge status={patient.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

// Helper function to render patients grouped by district
const renderPatientsByDistrict = (patients: any[]) => {
  const patientsByDistrict: Record<string, any[]> = {};
  
  // Group patients by district
  patients.forEach(patient => {
    if (!patientsByDistrict[patient.district]) {
      patientsByDistrict[patient.district] = [];
    }
    patientsByDistrict[patient.district].push(patient);
  });
  
  // Sort districts alphabetically
  const sortedDistricts = Object.keys(patientsByDistrict).sort();
  
  // Create rows with district headers
  return sortedDistricts.flatMap((district, index) => {
    const patients = patientsByDistrict[district];
    
    return [
      <tr key={`district-${index}`} className="bg-muted/50">
        <td colSpan={5} className="px-4 py-2 font-medium">
          Bairro: {district} ({patients.length} paciente(s))
        </td>
      </tr>,
      ...patients.map(patient => (
        <tr key={patient.id} className="border-b">
          <td className="px-4 py-2">{patient.name}</td>
          <td className="px-4 py-2">{patient.district}</td>
          <td className="px-4 py-2">{patient.address}</td>
          <td className="px-4 py-2">{patient.phones[0]}</td>
          <td className="px-4 py-2">
            <StatusBadge status={patient.status} />
          </td>
        </tr>
      ))
    ];
  });
};

export default Reports;
