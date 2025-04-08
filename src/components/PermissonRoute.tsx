import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import { Navigate } from "react-router-dom";

import { toast } from "sonner";

interface PermissionRouteProps {
  children: React.ReactNode;
  permission: string;
  redirectTo?: string;
}

const PermissionRoute: React.FC<PermissionRouteProps> = ({ 
  children, 
  permission, 
  redirectTo = "/" 
}) => {
  const { isAuthenticated, hasPermission } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!hasPermission(permission)) {
    toast.error("Você não tem permissão para acessar esta página");
    return <Navigate to={redirectTo} />;
  }
  
  return <>{children}</>;
};

export default PermissionRoute;