'use client';

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { Ticket } from '@/types/ticket';

interface CancelDialogProps {
  open: boolean;
  ticket: Ticket | null;
  cancelling: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const CancelDialog = ({ open, ticket, cancelling, onClose, onConfirm }: CancelDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="cancel-dialog-title"
      aria-describedby="cancel-dialog-description"
    >
      <DialogTitle id="cancel-dialog-title">
        {"Deseja realmente cancelar este ingresso?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="cancel-dialog-description">
          Esta ação é **irreversível**. O assento <strong>{ticket?.seatNumber}</strong> para a sessão de <strong>{ticket?.event.title}</strong> será devolvido imediatamente para o inventário do cinema e ficará disponível para outros clientes comprarem. O estorno será processado na sua forma de pagamento.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit" disabled={cancelling}>
          Manter Ingresso
        </Button>
        <Button 
          onClick={onConfirm} 
          color="error" 
          variant="contained"
          autoFocus
          disabled={cancelling}
        >
          {cancelling ? 'Cancelando...' : 'Sim, Cancelar e Estornar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};