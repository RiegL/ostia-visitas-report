import React, { useState } from "react";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ministerService } from "@/services/ministerService";
import { Minister } from "@/types";
import { Pencil, Trash2, User, UserPlus, Phone, Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type MinisterFormData = {
  name: string;
  phone: string;
  username: string;
  role: "admin" | "user";
  password: string;
};

const MinisterList = () => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ministerIdToDelete, setMinisterIdToDelete] = useState<number | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMinister, setSelectedMinister] = useState<Minister | null>(
    null
  );
  const [formData, setFormData] = useState<MinisterFormData>({
    name: "",
    phone: "",
    username: "",
    role: "user",
    password: "",
  });

  const { data: ministers, isLoading } = useQuery({
    queryKey: ["ministers"],
    queryFn: ministerService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Minister, "id">) => ministerService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministers"] });
      toast.success("Ministro cadastrado com sucesso");
      setIsAddDialogOpen(false);
      setFormData({
        name: "",
        phone: "",
        username: "",
        role: "user",
        password: "",
      });
    },
    onError: () => {
      toast.error("Erro ao cadastrar ministro");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: {
      id: number;
      updates: Partial<Omit<Minister, "id">>;
    }) => ministerService.update(data.id, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministers"] });
      toast.success("Ministro atualizado com sucesso");
      setIsEditDialogOpen(false);
      setSelectedMinister(null);
    },
    onError: () => {
      toast.error("Erro ao atualizar ministro");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => ministerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministers"] });
      toast.success("Ministro removido com sucesso");
    },
    onError: () => {
      toast.error("Erro ao remover ministro");
    },
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.username.trim() ||
      !formData.role
    ) {
      toast.error("Preencha todos os campos");
      return;
    }
    createMutation.mutate(formData);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMinister) return;
    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.username.trim() ||
      !formData.role
    ) {
      toast.error("Preencha todos os campos");
      return;
    }
    updateMutation.mutate({
      id: selectedMinister.id,
      updates: formData,
    });
  };

  const handleDelete = (id: number) => {
    setMinisterIdToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (ministerIdToDelete !== null) {
      deleteMutation.mutate(ministerIdToDelete);
      setDeleteDialogOpen(false);
      setMinisterIdToDelete(null);
    }
  };

  const openEditDialog = (minister: Minister) => {
    setSelectedMinister(minister);
    setFormData({
      name: minister.name,
      phone: minister.phone,
      username: minister.username,
      role: minister.role,
      password: minister.password,
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
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nome do ministro"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Telefone para contato"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  placeholder="Nome de usuário para login"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Senha para login"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Função</Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as "admin" | "user",
                    })
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                >
                  <option value="user">Usuário</option>
                  <option value="admin">Administrador</option>
                </select>
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
                    <th className="px-4 py-2 font-medium">Usuário</th>
                    <th className="px-4 py-2 font-medium">Tipo</th>
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
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />
                          {minister.username}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center">
                          <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                          {minister.role === "admin" ? "Admin" : "Usuário"}
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
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Nome do ministro"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Telefone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Telefone para contato"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-username">Usuário</Label>
              <Input
                id="edit-username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="Nome de usuário para login"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Senha para login"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Função</Label>
              <select
                id="edit-role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as "admin" | "user",
                  })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
              >
                <option value="minister">Ministro</option>
                <option value="admin">Administrador</option>
              </select>
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
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tem certeza?</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            Essa ação não pode ser desfeita. Deseja realmente remover este
            ministro?
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Remover
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default MinisterList;
