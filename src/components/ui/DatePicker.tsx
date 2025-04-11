import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format, parseISO, isBefore } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

export function DatePicker({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (date: Date) => void;
}) {
  const selected = value ? parseISO(value) : undefined;

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
  
    // Zera a hora SEM fuso nem conversão
    selectedDate.setHours(0, 0, 0, 0);
    onChange(selectedDate);
  };
  

  const isPast = (day: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isBefore(day, today);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[200px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "dd/MM/yyyy") : <span>Selecionar data</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleDateChange}
          disabled={isPast}
        />
      </PopoverContent>
    </Popover>
  );
}
