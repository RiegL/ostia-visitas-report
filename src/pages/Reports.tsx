import { useState } from "react";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { patientService } from "@/services/patientService";
import { StatusBadge } from "@/components/ui/status-badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { FileText, Printer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ... [imports permanecem os mesmos]

const Reports = () => {
  const [reportType, setReportType] = useState<string>("active");
  const [modalObservation, setModalObservation] = useState<string | null>(null);

  const { data: patients, isLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: patientService.getAll,
  });

  const getFilteredPatients = () => {
    if (!patients) return [];

    switch (reportType) {
      case "active":
        return patients.filter((p) => p.status === "active");
      case "recovered":
        return patients.filter((p) => p.status === "recovered");
      case "deceased":
        return patients.filter((p) => p.status === "deceased");
      case "byDistrict":
        return [...patients].sort((a, b) =>
          a.district.localeCompare(b.district)
        );
      case "all":
      default:
        return patients;
    }
  };

  const filteredPatients = getFilteredPatients();

  const getReportTitle = () => {
    switch (reportType) {
      case "active":
        return "Pessoas Ativas";
      case "recovered":
        return "Pessoas Recuperadas";
      case "deceased":
        return "Pessoas Falecidas";
      case "byDistrict":
        return "Pessoas por Bairro";
      case "all":
      default:
        return "Todas as Pessoas";
    }
  };

  const printReport = () => {
    window.print();
  };

  return (
    <Layout>
      <Dialog
        open={!!modalObservation}
        onOpenChange={() => setModalObservation(null)}
      >
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto bg-white rounded-xl shadow-2xl border border-gray-200">
          <DialogHeader>
            <DialogTitle>Observações</DialogTitle>
          </DialogHeader>
          <div className="whitespace-pre-line text-md leading-relaxed">
            {modalObservation}
          </div>
        </DialogContent>
      </Dialog>

      <div className="print:hidden">
        <PageHeader
          title="Relatórios"
          subtitle="Visualize relatórios por categoria"
        >
          <div className="flex space-x-2">
            <Button variant="outline" onClick={printReport} className="flex items-center">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
          </div>
        </PageHeader>

        <div className="mb-6">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Selecione o tipo de relatório" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Pessoas Ativas</SelectItem>
              <SelectItem value="recovered">Pessoas Recuperadas</SelectItem>
              <SelectItem value="deceased">Pessoas Falecidas</SelectItem>
              <SelectItem value="byDistrict">Pessoas por Bairro</SelectItem>
              <SelectItem value="all">Todas as Pessoas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="print-area">
        <Card className="overflow-hidden print:border-none print:shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center mb-4">
                <FileText className="mr-2 h-5 w-5 print:hidden" />
                Relatório: {getReportTitle()}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Total: {filteredPatients.length} pessoa(s)
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
                <p>Nenhuma pessoa encontrada para este relatório.</p>
              </div>
            ) : (
              <>
                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {reportType === "byDistrict"
                    ? renderCardsByDistrict(filteredPatients, setModalObservation)
                    : filteredPatients.map((patient) => (
                        <div
                          key={patient.id}
                          className="border rounded-md p-4 bg-white shadow-sm"
                        >
                          <p className="font-semibold">{patient.name}</p>
                          <p><strong>Bairro:</strong> {patient.district}</p>
                          <p><strong>Endereço:</strong> {patient.address}</p>
                          <p><strong>Telefone:</strong> {patient.phones[0]}</p>
                          <p>
                            <strong>Status:</strong>{" "}
                            <StatusBadge status={patient.status} />
                          </p>
                          {patient.observations && (
                            <p>
                              <strong>Observações:</strong>{" "}
                              <span className="print:hidden">
                                {patient.observations.length > 30 ? (
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="px-0"
                                    onClick={() =>
                                      setModalObservation(patient.observations)
                                    }
                                  >
                                    Ver
                                  </Button>
                                ) : (
                                  <span className="whitespace-pre-line">
                                    {patient.observations}
                                  </span>
                                )}
                              </span>
                              <span className="hidden print:inline whitespace-pre-line">
                                {patient.observations}
                              </span>
                            </p>
                          )}
                        </div>
                      ))}
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="px-4 py-2 font-medium">Nome</th>
                        <th className="px-4 py-2 font-medium">Bairro</th>
                        <th className="px-4 py-2 font-medium">Endereço</th>
                        <th className="px-4 py-2 font-medium">Telefone</th>
                        <th className="px-4 py-2 font-medium">Observações</th>
                        <th className="px-4 py-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportType === "byDistrict"
                        ? renderPatientsByDistrict(filteredPatients, setModalObservation)
                        : filteredPatients.map((patient) => (
                            <tr key={patient.id} className="border-b">
                              <td className="px-4 py-2">{patient.name}</td>
                              <td className="px-4 py-2">{patient.district}</td>
                              <td className="px-4 py-2">{patient.address}</td>
                              <td className="px-4 py-2">{patient.phones[0]}</td>
                              <td className="px-4 py-2 align-top max-w-[300px]">
                                <span className="print:hidden">
                                  {patient.observations?.length > 30 ? (
                                    <Button
                                      variant="link"
                                      size="sm"
                                      className="px-0"
                                      onClick={() =>
                                        setModalObservation(patient.observations)
                                      }
                                    >
                                      Ver
                                    </Button>
                                  ) : (
                                    <span className="whitespace-pre-line">
                                      {patient.observations || "-"}
                                    </span>
                                  )}
                                </span>
                                <span className="hidden print:inline whitespace-pre-line">
                                  {patient.observations || "-"}
                                </span>
                              </td>
                              <td className="px-4 py-2">
                                <StatusBadge status={patient.status} />
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area,
          .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </Layout>
  );
};

// Reaproveita lógica para agrupamento por bairro

const renderPatientsByDistrict = (
  patients: any[],
  setModal: (value: string) => void
) => {
  const patientsByDistrict: Record<string, any[]> = {};
  patients.forEach((p) => {
    if (!patientsByDistrict[p.district]) patientsByDistrict[p.district] = [];
    patientsByDistrict[p.district].push(p);
  });

  return Object.entries(patientsByDistrict).flatMap(([district, group], i) => [
    <tr key={`d-${i}`} className="bg-muted/50">
      <td colSpan={6} className="px-4 py-2 font-medium">
        Bairro: {district} ({group.length} pessoa(s))
      </td>
    </tr>,
    ...group.map((p) => (
      <tr key={p.id} className="border-b">
        <td className="px-4 py-2">{p.name}</td>
        <td className="px-4 py-2">{p.district}</td>
        <td className="px-4 py-2">{p.address}</td>
        <td className="px-4 py-2">{p.phones[0]}</td>
        <td className="px-4 py-2 align-top max-w-[300px]">
          <span className="print:hidden">
            {p.observations?.length > 30 ? (
              <Button
                variant="link"
                size="sm"
                className="px-0"
                onClick={() => setModal(p.observations)}
              >
                Ver
              </Button>
            ) : (
              <span className="whitespace-pre-line">
                {p.observations || "-"}
              </span>
            )}
          </span>
          <span className="hidden print:inline whitespace-pre-line">
            {p.observations || "-"}
          </span>
        </td>
        <td className="px-4 py-2">
          <StatusBadge status={p.status} />
        </td>
      </tr>
    )),
  ]);
};

const renderCardsByDistrict = (
  patients: any[],
  setModal: (value: string) => void
) => {
  const patientsByDistrict: Record<string, any[]> = {};
  patients.forEach((p) => {
    if (!patientsByDistrict[p.district]) patientsByDistrict[p.district] = [];
    patientsByDistrict[p.district].push(p);
  });

  return Object.entries(patientsByDistrict).flatMap(([district, group], i) => [
    <div
      key={`district-${i}`}
      className="text-sm font-medium text-muted-foreground"
    >
      Bairro: {district} ({group.length} pessoa(s))
    </div>,
    ...group.map((p) => (
      <div key={p.id} className="border rounded-md p-4 bg-white shadow-sm">
        <p className="font-semibold">{p.name}</p>
        <p><strong>Endereço:</strong> {p.address}</p>
        <p><strong>Telefone:</strong> {p.phones[0]}</p>
        <p>
          <strong>Status:</strong> <StatusBadge status={p.status} />
        </p>
        {p.observations && (
          <p>
            <strong>Observações:</strong>{" "}
            <span className="print:hidden">
              {p.observations.length > 30 ? (
                <Button
                  variant="link"
                  size="sm"
                  className="px-0"
                  onClick={() => setModal(p.observations)}
                >
                  Ver
                </Button>
              ) : (
                <span className="whitespace-pre-line">{p.observations}</span>
              )}
            </span>
            <span className="hidden print:inline whitespace-pre-line">
              {p.observations}
            </span>
          </p>
        )}
      </div>
    )),
  ]);
};

export default Reports;

