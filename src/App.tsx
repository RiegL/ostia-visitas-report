
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import PatientList from "./pages/PatientList";
import PatientDetails from "./pages/PatientDetails";
import NewPatient from "./pages/NewPatient";
import Reports from "./pages/Reports";
import MinisterList from "./pages/MinisterList";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { Toaster } from "./components/ui/toaster";
import PermissionRoute from "./components/PermissonRoute";
import { useEffect } from "react";
import { App as CapApp } from "@capacitor/core";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/patients" element={<ProtectedRoute><PatientList /></ProtectedRoute>} />
      <Route path="/patients/new" element={<ProtectedRoute><NewPatient /></ProtectedRoute>} />
      <Route path="/patients/:id" element={<ProtectedRoute><PatientDetails /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route 
        path="/ministers" 
        element={
          <PermissionRoute permission="manage_ministers">
            <MinisterList />
          </PermissionRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  // Manipulador para eventos de back (voltar) no Android
  useEffect(() => {
    const handleAndroidBackButton = () => {
      if (window.location.pathname === "/login") {
        // Se estiver na tela de login, confirmar saída do app
        if (window.confirm("Deseja sair do aplicativo?")) {
          CapApp.exitApp();
        }
      }
      // Outros caminhos usam o comportamento padrão de navegação
    };

    document.addEventListener('ionBackButton', handleAndroidBackButton);
    
    return () => {
      document.removeEventListener('ionBackButton', handleAndroidBackButton);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
