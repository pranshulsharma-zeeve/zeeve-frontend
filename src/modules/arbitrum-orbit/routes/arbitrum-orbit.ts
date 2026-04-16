/** Application PAGES. Check `src/app`. Dynamic page routes must not be declared here.
 * @ THIS DOES NOT DEFINE ROUTES FOR THE APPLICATION. USED FOR REDIRECTION ONLY.
 */
const BASE = "/arbitrum-orbit";

const PAGE = {
  LIST: BASE,
  DEPLOY: `${BASE}/deploy`,
  PURCHASE: `${BASE}/purchase`,
  PAYMENT_STATUS: `${BASE}/payment-status`,
  NETWORK: `${BASE}/network`,
};

/** Must contain RESOURCE url only.
 * For example, a simple RESTful API might have the following endpoints:
 * ```text
 * /users - to retrieve a list of all users (GET)
 * /users/:id - to retrieve a specific user by ID (GET)
 * /users - to create a new user (POST)
 * /users/:id - to update an existing user by ID (PUT)
 * /users/:id - to delete an existing user by ID (DELETE)
 * ```
 * In this example, the endpoints define the actions that a client can perform on the server's user RESOURCE.
 */
const API = {
  NETWORKS: "/v1/networks",
  CONFIGS: "/v1/configs",
  PAYMENTS: "/v1/payments",
  CLOUDS: "/clouds",
};

/** Routes for this app and its backend apis. */
const ARBITRUM_ORBIT_ROUTES = {
  PAGE,
  API,
};

export default ARBITRUM_ORBIT_ROUTES;
