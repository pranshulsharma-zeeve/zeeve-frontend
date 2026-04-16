import axios, { AxiosError } from "axios";
import { PlatformServiceError } from "./types";

export const handleError = (message: string, error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<PlatformServiceError>;
    const errorMessage = axiosError.response?.data?.message || "Unknown Axios error occurred";
    console.error(`${message}: ${errorMessage}`);
  } else {
    console.error(`${message}:`, error);
  }
  throw new Error(message);
};
