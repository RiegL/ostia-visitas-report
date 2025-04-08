
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Users, UserCheck, UserX, PlusCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { patientService } from "@/services/patientService";

const Index = () => {
  const { data: patients, isLoading: isLoadingPatients } = useQuery({
    queryKey: ['patients'],
    queryFn: patientService.getAll,
  });

  const activeCount = patients?.filter(p => p.status === 'active').length || 0;
  const recoveredCount = patients?.filter(p => p.status === 'recovered').length || 0;
  const deceasedCount = patients?.filter(p => p.status === 'deceased').length || 0;
  const totalCount = patients?.length || 0;

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-pastoral-400">Bem-vindo ao Sistema de Visitas</h1>
            <p className="text-muted-foreground">Gerencie os pacientes e relatórios de visitas</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild className="bg-pastoral-400 hover:bg-pastoral-500">
              <Link to="/patients/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Paciente
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Pacientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {isLoadingPatients ? "..." : totalCount}
                </div>
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pacientes Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-green-600">
                  {isLoadingPatients ? "..." : activeCount}
                </div>
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Recuperados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-blue-600">
                  {isLoadingPatients ? "..." : recoveredCount}
                </div>
                <UserCheck className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Falecidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-gray-600">
                  {isLoadingPatients ? "..." : deceasedCount}
                </div>
                <UserX className="h-6 w-6 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Acesso Rápido</CardTitle>
              <CardDescription>
                Navegue entre as principais funções do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20" asChild>
                <Link to="/patients" className="flex flex-col items-center justify-center">
                  <Users className="mb-2 h-6 w-6" />
                  <span>Lista de Pacientes</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20" asChild>
                <Link to="/patients/new" className="flex flex-col items-center justify-center">
                  <PlusCircle className="mb-2 h-6 w-6" />
                  <span>Novo Paciente</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20" asChild>
                <Link to="/reports" className="flex flex-col items-center justify-center">
                  <UserCheck className="mb-2 h-6 w-6" />
                  <span>Relatórios</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20" asChild>
                <Link to="/ministers" className="flex flex-col items-center justify-center">
                  <Users className="mb-2 h-6 w-6" />
                  <span>Ministros</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sobre o Sistema</CardTitle>
              <CardDescription>
                Informações sobre o uso do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                Este sistema foi desenvolvido para auxiliar o gerenciamento de visitas pastorais aos doentes.
              </p>
              <p>
                Você pode cadastrar pacientes, atualizar o status deles quando se recuperarem ou
                falecerem, e manter um registro organizado das visitas realizadas.
              </p>
              <p>
                Para começar, adicione um novo paciente clicando no botão "Novo Paciente"
                ou acesse a lista completa em "Pacientes".
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
