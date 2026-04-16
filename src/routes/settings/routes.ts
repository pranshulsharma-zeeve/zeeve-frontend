import { withApiBasePath } from "@/constants/api";

const PAGE = {
  ROOT: "/settings",
} as const;

const API = {
  USER_INFO: withApiBasePath("/user-info"),
  CHANGE_PASSWORD: withApiBasePath("/change-password"),
  LIST_SUBSCRIPTION: withApiBasePath("/list/subscription"),
} as const;

const SETTINGS_ROUTES = {
  PAGE,
  API,
} as const;

export default SETTINGS_ROUTES;
