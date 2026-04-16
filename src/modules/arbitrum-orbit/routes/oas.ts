import { withApiBasePath } from "@/constants/api";

const PAGE = {};

const API = {
  ALERTS: withApiBasePath("/alert"),
};

const OAS_ROUTES = {
  PAGE,
  API,
};

export default OAS_ROUTES;
