import axios from "axios";
import { getConfig } from "@/config";

// get config
const config = getConfig();

/** Axios instance for internal/current app's backend. */
const backendAxiosInstance = axios.create({
  baseURL: config.url?.internal?.backend,
});

export { backendAxiosInstance };
