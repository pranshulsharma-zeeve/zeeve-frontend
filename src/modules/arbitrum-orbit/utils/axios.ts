import axios from "axios";

/**
 * Use the app-wide axios defaults managed by AxiosProvider.
 * This ensures auth/refresh and baseURL behavior stays consistent.
 */
const backendAxiosInstance = axios;

export { backendAxiosInstance };
