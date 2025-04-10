
import { useState } from "react";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PatientForm from "@/components/PatientForm";

const NewPatient = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <PageHeader 
        title="Cadastrar Novo Doente" 
        subtitle="Preencha os dados do doente para cadastro"
      >
        <Button variant="outline" onClick={() => navigate("/patients")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </PageHeader>

      <PatientForm />
    </Layout>
  );
};

export default NewPatient;
