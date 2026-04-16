import ANALYTICS_ROUTES from "./analytics";
import AUTH_ROUTES from "./auth";
import OAS_ROUTES from "./oas";
import OLD_PLATFORM_ROUTES from "./old-platform";
import PLATFORM_ROUTES from "./platform";
import ZDFS_ROUTES from "./zdfs";
import SETTINGS_ROUTES from "./settings/routes";
import VALIDIUM_ROUTES from "./validium";
import VISION_ROUTES from "./vision";

/** Routes. */
const ROUTES = {
  ANALYTICS: ANALYTICS_ROUTES,
  AUTH: AUTH_ROUTES,
  OAS: OAS_ROUTES,
  OLD_PLATFORM: OLD_PLATFORM_ROUTES,
  PLATFORM: PLATFORM_ROUTES,
  ZDFS: ZDFS_ROUTES,
  SETTINGS: SETTINGS_ROUTES,
  VALIDIUM: VALIDIUM_ROUTES,
  SUBSCRIPTION: PLATFORM_ROUTES.API.SUBSCRIPTIONS,
  NETWORKS: PLATFORM_ROUTES.API.NETWORKS,
  VISION: VISION_ROUTES,
};

export default ROUTES;
