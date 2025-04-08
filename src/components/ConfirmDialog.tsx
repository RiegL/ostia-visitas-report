
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
  } from "@mui/material";
  
  interface ConfirmDialogProps {
    open: boolean;
    title?: string;
    description?: string;
    onClose: () => void;
    onConfirm: () => void;
  }
  
  export const ConfirmDialog = ({
    open,
    title = "Confirmação",
    description = "Tem certeza que deseja continuar?",
    onClose,
    onConfirm,
  }: ConfirmDialogProps) => {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Typography>{description}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={onConfirm} variant="contained" color="error">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  