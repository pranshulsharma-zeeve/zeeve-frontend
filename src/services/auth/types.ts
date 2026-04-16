type AuthServiceError = {
  success?: boolean;
  message?: string;
  error?: {
    code?: string;
    message?: string;
  };
};

export type { AuthServiceError };
