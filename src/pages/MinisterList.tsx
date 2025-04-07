
import { useState } from "react";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ministerService } from "@/services/mockData";
import { Minister } from "@/types";
import { Pencil, Trash2, User, UserPlus, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const MinisterList = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMinister, setSelectedMinister] = useState<Minister | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const { data: ministers, isLoading } = useQuery({
    queryKey: ['ministers'],
    queryFn: ministerService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Minister, 'id'>) => {
      return ministerService.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ministers'] });
      toast.success("Ministro cadastrado com sucesso");
      setIsAddDialogOpen(false);
      setFormData({ name: "", phone: "" });
    },
    onError: () => {
      toast.error("Erro ao cadastrar ministro");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; updates: Partial<Omit<Minister, 'id'>> }) => {
      return ministerService.update(data.id, data.updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ministers'] });
      toast.success("Ministro atualizado com sucesso");
      setIsEditDialogOpen(false);
      setSelectedMinister(null);
    },
    onError: () => {
      toast.error("Erro ao atualizar ministro");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return ministerService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ministers'] });
      toast.success("Ministro removido com sucesso");
    },
    onError: () => {
      toast.error("Erro ao remover ministro");
    },
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }
    createMutation.mutate(formData);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMinister) return;
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }
    updateMutation.mutate({
      id: selectedMinister.id,
      updates: formData,
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja remover este ministro?")) {
      deleteMutation.mutate(id);
    }
  };

  const openEditDialog = (minister: Minister) => {
    setSelectedMinister(minister);
    setFormData({
      name: minister.name,
      phone: minister.phone,
    });
    setIsEditDialogOpen(true);
  };

  return (
    <Layout>
      <PageHeader 
        title="Ministros" 
        subtitle="Gerencie os ministros que realizarão as visitas"
      >
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Ministro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Ministro</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome do ministro"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Telefone para contato"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Cadastrar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Ministros</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">Carregando ministros...</div>
          ) : ministers && ministers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="px-4 py-2 font-medium">Nome</th>
                    <th className="px-4 py-2 font-medium">Telefone</th>
                    <th className="px-4 py-2 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {ministers.map((minister) => (
                    <tr key={minister.id} className="border-b">
                      <td className="px-4 py-2">
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />
                          {minister.name}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center">
                          <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                          {minister.phone}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(minister)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(minister.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="mb-4">Nenhum ministro cadastrado</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Cadastrar Ministro
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Ministro</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome completo</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome do ministro"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Telefone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Telefone para contato"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Atualizar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default MinisterList;
