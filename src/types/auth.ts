export interface LoginApiResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'CONSUMER' | 'ORGANIZER' | 'VALIDATOR';
  };
}

export interface RegisterApiResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'CONSUMER' | 'ORGANIZER' | 'VALIDATOR';
  };
}