
import React, { createContext, useState, useContext, useEffect } from "react";
import { Minister, AuthContext as AuthContextType } from "@/types";
import { ministerService } from "@/services/ministerService";
import { toast } from "sonner";

const AuthContext = createContext<AuthContextType>({
  minister: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [minister, setMinister] = useState<Minister | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar se há um ministro salvo no localStorage
    const savedMinister = localStorage.getItem("minister");
    if (savedMinister) {
      try {
        const parsedMinister = JSON.parse(savedMinister);
        setMinister(parsedMinister);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Erro ao recuperar dados do ministro:", error);
        localStorage.removeItem("minister");
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const authenticatedMinister = await ministerService.authenticate(username, password);
      
      if (authenticatedMinister) {
        setMinister(authenticatedMinister);
        setIsAuthenticated(true);
        localStorage.setItem("minister", JSON.stringify(authenticatedMinister));
        toast.success(`Bem-vindo, ${authenticatedMinister.name}!`);
        return true;
      } else {
        toast.error("Credenciais inválidas. Tente novamente.");
        return false;
      }
    } catch (error) {
      console.error("Erro durante o login:", error);
      toast.error("Erro ao fazer login. Tente novamente mais tarde.");
      return false;
    }
  };

  const logout = () => {
    setMinister(null);
    setIsAuthenticated(false);
    localStorage.removeItem("minister");
    toast.info("Você saiu do sistema.");
  };

  return (
    <AuthContext.Provider value={{ minister, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
