import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { patientService } from "@/services/patientService";
import { toast } from "sonner";
import { ArrowLeft, Phone, MapPin, User, Pencil, FileText } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import PatientForm from "@/components/PatientForm";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Patient, PatientStatus } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const PatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isObservationsDialogOpen, setIsObservationsDialogOpen] =
    useState(false);
  const [newStatus, setNewStatus] = useState<PatientStatus>("active");
  const [observations, setObservations] = useState("");

  const {
    data: patient,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["patient", id],
    queryFn: () => patientService.getById(id!),
    enabled: !!id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: PatientStatus) =>
      patientService.update(id!, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient", id] });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Status do paciente atualizado com sucesso");
      setIsStatusDialogOpen(false);
    },
    onError: () => {
      toast.error("Erro ao atualizar status do paciente");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => patientService.delete(id!),
    onSuccess: () => {
      toast.success("Paciente removido com sucesso");
      navigate("/patients");
    },
    onError: () => {
      toast.error("Erro ao remover paciente");
    },
  });

  const handleStatusChange = () => {
    updateStatusMutation.mutate(newStatus);
  };

  const handleDeletePatient = () => {
    if (
      window.confirm(
        "Tem certeza que deseja remover este paciente? Esta ação não pode ser desfeita."
      )
    ) {
      deleteMutation.mutate();
    }
  };

  const handleUpdateObservations = () => {
    patientService
      .update(patient.id, { observations })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["patient", patient.id] });
        queryClient.invalidateQueries({ queryKey: ["patients"] });
        toast.success("Observações atualizadas com sucesso");
        setIsObservationsDialogOpen(false);
      })
      .catch((error) => {
        console.error("Erro ao atualizar observações:", error);
        toast.error("Erro ao atualizar observações");
      });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-[50vh] items-center justify-center">
          <p>Carregando informações do paciente...</p>
        </div>
      </Layout>
    );
  }

  if (isError || !patient) {
    return (
      <Layout>
        <div className="flex h-[50vh] flex-col items-center justify-center">
          <p className="mb-4 text-lg">Paciente não encontrado</p>
          <Button variant="outline" onClick={() => navigate("/patients")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a lista
          </Button>
        </div>
      </Layout>
    );
  }

  const formattedCreatedAt = format(parseISO(patient.createdAt), "PPP", {
    locale: ptBR,
  });
  const formattedUpdatedAt = format(parseISO(patient.updatedAt), "PPP", {
    locale: ptBR,
  });

  return (
    <Layout>
      <PageHeader title="Detalhes do Paciente">
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate("/patients")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Editar Paciente</DialogTitle>
              </DialogHeader>
              <PatientForm initialData={patient} isEditing={true} />
            </DialogContent>
          </Dialog>
        </div>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between ">
                <div>
                  <CardTitle className="flex items-center mb-2">
                    <User className="mr-2 h-6 w-5" />
                    {patient.name}
                  </CardTitle>
                  <CardDescription>
                    Cadastrado em {formattedCreatedAt}
                  </CardDescription>
                </div>
                <StatusBadge status={patient.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="flex items-center text-sm font-medium text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  Endereço
                </h3>
                <p className="mt-1">{patient.address}</p>
                <p className="text-sm">Bairro: {patient.district}</p>
              </div>

              <Separator />

              <div>
                <h3 className="flex items-center text-sm font-medium text-muted-foreground">
                  <Phone className="mr-2 h-4 w-4" />
                  Telefones para contato
                </h3>
                <div className="mt-1 space-y-1">
                  {patient.phones.map((phone, index) => (
                    <p key={index}>{phone}</p>
                  ))}
                </div>
              </div>

              <Separator />

              <h3 className="flex items-center text-sm font-medium text-muted-foreground">
                <FileText className="mr-2 h-4 w-4" />
                Observações
              </h3>
              {patient.observations && (
                <div>
                  <p className="mt-1">
                    {patient.observations || "Nenhuma observação"}
                  </p>
                </div>
              )}

              <Separator />

              <div className="text-sm text-muted-foreground">
                <p>Última atualização: {formattedUpdatedAt}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Botão para alterar status */}
              <Dialog
                open={isStatusDialogOpen}
                onOpenChange={setIsStatusDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Alterar Status
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Alterar Status do Paciente</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <RadioGroup
                      value={newStatus}
                      onValueChange={(value) =>
                        setNewStatus(value as PatientStatus)
                      }
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="active" id="status-active" />
                        <Label htmlFor="status-active">
                          Ativo (recebendo visitas)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="recovered"
                          id="status-recovered"
                        />
                        <Label htmlFor="status-recovered">
                          Recuperado (não precisa mais de visitas)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="deceased" id="status-deceased" />
                        <Label htmlFor="status-deceased">Falecido</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsStatusDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleStatusChange}>Confirmar</Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Botão para atualizar observações */}
              <Dialog
                open={isObservationsDialogOpen}
                onOpenChange={setIsObservationsDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Atualizar Observações
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Observações do Paciente</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <Textarea
                      value={observations}
                      onChange={(e) => setObservations(e.target.value)}
                      placeholder="Anote aqui as observações sobre o paciente..."
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsObservationsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleUpdateObservations}>Salvar</Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Botão de remoção */}
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleDeletePatient}
              >
                Remover Paciente
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PatientDetails;
