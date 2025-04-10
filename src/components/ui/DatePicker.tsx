import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

export function DatePicker({
  date,
  onChange,
}: {
  date: Date | undefined;
  onChange: (date: Date) => void;
}) {
  const handleDateChange = (selectedDate: Date) => {
    // Aqui, criamos uma nova data com as mesmas informações, mas sem a hora
    const dateOnly = new Date(selectedDate);
    dateOnly.setHours(0, 0, 0, 0);  // Definindo hora como 00:00:00 para evitar problemas com fuso horário

    onChange(dateOnly);  // Passamos a data ajustada sem fuso horário
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[200px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd/MM/yyyy") : <span>Selecionar data</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
        />
      </PopoverContent>
    </Popover>
  );
}
