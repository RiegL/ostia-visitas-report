
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Patient, PatientStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { patientService } from "@/services/mockData";
import { X, Plus } from "lucide-react";

interface PatientFormProps {
  initialData?: Partial<Patient>;
  isEditing?: boolean;
}

const PatientForm: React.FC<PatientFormProps> = ({
  initialData = {},
  isEditing = false,
}) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [name, setName] = useState(initialData.name || "");
  const [address, setAddress] = useState(initialData.address || "");
  const [district, setDistrict] = useState(initialData.district || "");
  const [phones, setPhones] = useState<string[]>(initialData.phones || ["", "", ""]);
  const [status, setStatus] = useState<PatientStatus>(
    initialData.status || "active"
  );

  const handlePhoneChange = (index: number, value: string) => {
    const newPhones = [...phones];
    newPhones[index] = value;
    setPhones(newPhones);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Filter out empty phone numbers
      const filteredPhones = phones.filter(phone => phone.trim() !== "");
      
      if (filteredPhones.length === 0) {
        toast.error("Adicione pelo menos um telefone para contato");
        setIsSubmitting(false);
        return;
      }
      
      if (isEditing && initialData.id) {
        // Update existing patient
        await patientService.update(initialData.id, {
          name,
          address,
          district,
          phones: filteredPhones,
          status,
        });
        
        toast.success("Paciente atualizado com sucesso");
      } else {
        // Create new patient
        await patientService.create({
          name,
          address,
          district,
          phones: filteredPhones,
          status,
        });
        
        toast.success("Paciente cadastrado com sucesso");
      }
      
      // Navigate back to patients list
      navigate("/patients");
    } catch (error) {
      console.error("Error saving patient:", error);
      toast.error("Erro ao salvar paciente. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Nome do paciente"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="address">Endereço</Label>
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="Rua, número, complemento"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="district">Bairro</Label>
              <Input
                id="district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
                placeholder="Bairro"
                className="mt-1"
              />
            </div>

            <div className="space-y-2">
              <Label>Telefones (até 3)</Label>
              {phones.map((phone, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={phone}
                    onChange={(e) => handlePhoneChange(index, e.target.value)}
                    placeholder={`Telefone ${index + 1}`}
                    className="mt-1"
                  />
                  {index < 2 && phone === "" && phones[index + 1] === "" && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0"
                      onClick={() => {
                        const newPhones = [...phones];
                        newPhones.splice(index, 1);
                        newPhones.push("");
                        setPhones(newPhones);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {isEditing && (
              <div>
                <Label>Status do Paciente</Label>
                <RadioGroup
                  value={status}
                  onValueChange={(value) => setStatus(value as PatientStatus)}
                  className="mt-2 flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="active" id="active" />
                    <Label htmlFor="active" className="cursor-pointer">
                      Ativo (recebendo visitas)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="recovered" id="recovered" />
                    <Label htmlFor="recovered" className="cursor-pointer">
                      Recuperado (não precisa mais de visitas)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="deceased" id="deceased" />
                    <Label htmlFor="deceased" className="cursor-pointer">
                      Falecido
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/patients")}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : isEditing ? "Atualizar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PatientForm;
