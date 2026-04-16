import axios from "axios";
import { getNormalizedApiBackend } from "@/utils/env";

/**
 * Axios instance for Odoo auth endpoints.
 * Base URL comes from NEXT_PUBLIC_API_URL (e.g. https://odoo-dev.zeeve.net)
 * Ensures cookies (e.g., refresh token) are sent/received.
 */
const baseURL = getNormalizedApiBackend();
const authAxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

export { authAxiosInstance };
