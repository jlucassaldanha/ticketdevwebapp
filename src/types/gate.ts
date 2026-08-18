export type ValidationStatus = 'NONE' | 'VALID' | 'ALREADY_USED' | 'WRONG_EVENT' | 'INVALID';

export interface ValidationResult {
  status: ValidationStatus;
  message: string;
  ticketDetails?: {
    movieTitle: string;
    seatNumber: string;
    clientName: string;
  };
}