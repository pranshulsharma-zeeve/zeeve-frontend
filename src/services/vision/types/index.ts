import { AxiosError } from "axios";

/** type of error response returned by vision backend service */
type VisionServiceError = AxiosError<{
  success?: boolean;
  message?: string;
}>;

export type { VisionServiceError };
