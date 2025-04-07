
import React from "react";
import { cn } from "@/lib/utils";
import { PatientStatus } from "@/types";

interface StatusBadgeProps {
  status: PatientStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusInfo = (status: PatientStatus) => {
    switch (status) {
      case "active":
        return {
          label: "Ativo",
          className: "bg-green-100 text-green-800 border-green-200",
        };
      case "recovered":
        return {
          label: "Recuperado",
          className: "bg-blue-100 text-blue-800 border-blue-200",
        };
      case "deceased":
        return {
          label: "Falecido",
          className: "bg-gray-100 text-gray-800 border-gray-200",
        };
      default:
        return {
          label: "Desconhecido",
          className: "bg-gray-100 text-gray-800 border-gray-200",
        };
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        statusInfo.className,
        className
      )}
    >
      {statusInfo.label}
    </span>
  );
}
