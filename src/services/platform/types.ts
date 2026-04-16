type PlatformServiceError = {
  success?: boolean;
  message?: string;
};

type CoreumServiceError = {
  error: {
    reason?: string;
    details?: string;
  };
};

export type { PlatformServiceError, CoreumServiceError };
