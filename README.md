# Application Front‑end 2.0

Next.js 14 (App Router) frontend for the Zeeve Platform that talks to an Odoo backend. This app implements secure authentication using short‑lived access tokens and long‑lived refresh tokens, handles automatic token refresh, attaches the token to all API requests, and redirects users appropriately on login/logout or error.

The app runs at http://localhost:3000 by default (see Scripts).

Important routing notes:

- All authentication URLs live under `/auth` (not `/platform/auth`).
- Root (`/`) redirects to `/auth/login`.
- Any non-auth HTML route (e.g., `/polygon-cdk/deploy`) redirects unauthenticated users to `/auth/login` rather than rendering a blank page.
- Auth redirects append `?serviceURL=<encoded>` so, after login, users are taken back to the page they originally requested.
- Backend URL is taken from `NEXT_PUBLIC_API_URL` in `.env` (e.g., `https://odoo-dev.zeeve.net`) and is used for all API calls.
- API path helpers share a central `API_BASE_PATH` constant (`/api/v1`).
- Settings lives at `/settings` and is bundled under `src/routes/settings`. It is protected by the same global auth guard as other app pages.

## 1) Project Overview

- Purpose: A modern React/Next.js frontend for a platform backed by Odoo. It renders dashboard and management views and integrates with other Zeeve services.
- Why access + refresh tokens: Access tokens are short‑lived (≈15m) and stored only in memory to reduce risk of token theft. A long‑lived refresh token (≈1h) is issued as an HttpOnly cookie by the backend and is not readable by JavaScript. This model allows silent refresh without exposing the refresh token to the browser environment.
- Frontend–backend interaction:
  - Login: `POST /api/v1/login` (on the auth backend) sets `refresh_token` cookie and returns a success payload with an access token (or places one in the `Authorization` header).
  - Refresh: `POST /api/v1/refresh` returns a new access token when the refresh cookie is valid.
  - Logout: `POST /api/v1/logout` clears the refresh cookie.
  - App uses an Axios instance for platform APIs and attaches `Authorization: Bearer <access_token>` to each request. Interceptors transparently refresh/ retry on `401` once.

## 2) Repository Structure

Key files and how they map to the requested concepts:

- `src/providers/auth-provider.tsx` (AuthContext equivalent)
  - Global auth guard for app pages, login redirection handling, and "Vision" user bootstrap. Reads access token from in‑memory storage and coordinates user bootstrap after authentication.

- `src/hooks/use-axios.tsx` (useAuth.ts equivalent consumer helper)
  - Hook that returns the shared Axios instance and a `setAuthToken` function so components/ services can operate with the global auth state.

- `src/providers/axios-provider.tsx` (api.ts equivalent)
  - Central Axios instance for platform APIs with:
    - `Authorization` header attachment from in‑memory token
    - 401 interceptor → `POST /api/v1/refresh` → retry once
    - Initial silent refresh on app load (if refresh cookie exists)
    - Proactive refresh scheduling based on JWT `exp` when present

- `src/app/auth/login/[[...slug]]/page-client.tsx` (pages/login.tsx equivalent)
  - The login UI at `/auth/login`. Calls `POST /api/v1/login` and, on success, stores the access token in memory and redirects to `/` (dashboard root).

- `src/app/(dashboard)/page-client.tsx` (pages/dashboard.tsx equivalent)
  - Dashboard entry point. Protected by middleware (cookie presence) and by the client auth guard.

- Supporting utilities:
  - `src/middleware.ts`: SSR/edge guard. Redirects unauthenticated HTML requests to `/auth/login` based on presence of refresh cookie.
  - `src/utils/auth-axios.ts`: Axios instance for auth endpoints (login/refresh/logout) with `withCredentials` enabled.
  - `src/utils/auth-token.ts`: In‑memory access token storage (never persisted in localStorage/sessionStorage).
- `src/providers/layout-provider/header.tsx`: Wires the Logout action to `POST /api/v1/logout`, clears in‑memory access token, and redirects to `/auth/login`.
- `src/routes/auth.ts`: Central definitions for auth routes and endpoints.
- `src/routes/settings/index.tsx`: Settings page wrapper with profile + subscription tabs, password modal, and notification preferences. Supporting components live under `src/routes/settings/components/`, and API/data orchestration lives in `src/routes/settings/hooks/useSettings.ts`.
- The subscriptions tab now consumes `GET /api/v1/subscriptions-list`, rendering both node subscriptions and rollup subscriptions with ID, status, billing date, subscription type, payment cadence, and cost summaries.

Notes

- The legacy names in the brief (AuthContext.tsx, useAuth.ts, api.ts, pages/\*.tsx) map to the actual files above because this project uses the Next.js App Router and providers.

### Settings Page UI Updates (Latest)

- Profile and subscription tabs (`src/routes/settings/components/Tabs.tsx`, `src/routes/settings/index.tsx`) now render icons from `@zeeve-platform/icons` to mirror the latest design.
- Subscription lists display a maximum of two cards at a time inside a vertical scroll container that reuses the shared `.scrollbar-thin-custom` styling.
- Subscription cards (`src/routes/settings/components/SubscriptionCard.tsx`) adopt the new #F9F9FB surface, right-aligned `View Receipt`/`Cancel Subscription` actions, and refreshed border/shadow treatments.
- Plan headings and subscription type labels now live outside the detail cards, with the inner blue container displaying plan amount, payment method, status, and validity in a two-column grid sourced directly from backend fields (`plan_name`, `node_name`, `amount`, `subscription_status`, `payment_method`, `valid_till`) while the page shell uses the updated full-width layout (`src/routes/settings/index.tsx`, `src/routes/settings/components/SubscriptionCard.tsx`).
- Billing tab (`src/routes/settings/components/BillingTab.tsx`) ships with responsive mock tables for rollups and smart nodes, a shared filter affordance, and download controls so the tab can later be wired to real invoice endpoints without modifying layout code.
- The settings canvas now introduces a bordered tab rail, refreshed profile cards with Google disconnect controls, and a soft gradient backdrop to match the latest product UI (`src/routes/settings/index.tsx`, `src/routes/settings/components/ProfileDetailsCard.tsx`, `src/routes/settings/components/Tabs.tsx`).

### Dashboard UI Updates (Latest)

- The dashboard now mirrors the latest light/dark Figma layouts with a new hero carousel, start-service tiles, and updated empty states (`src/app/(dashboard)/page-client.tsx`, `src/app/(dashboard)/_components/dashboard-hero.tsx`, `src/app/(dashboard)/_components/empty-state-card.tsx`).
- Subscriptions and alerts sections have refreshed cards and table styling while preserving all existing data wiring (`src/app/(dashboard)/_components/subscriptionsCard.tsx`, `src/app/(dashboard)/_components/alerts-card.tsx`).
- New service spotlight cards highlight Vizion and partner tools without altering backend integration (`src/app/(dashboard)/_components/first-time-user-cards.tsx`).
- Header now includes a light/dark mode toggle that persists the chosen theme and applies class-based dark mode (`src/components/theme-toggle-button.tsx`, `src/providers/layout-provider/header.tsx`, `src/app/layout.tsx`).

#### Figma References
- First-time user (Light): https://www.figma.com/design/Nq6CEc1vtidU3DpfKIxMRr/Zeeve-App-v2--Copy-?node-id=73-1595&m=dev
- First-time user (Dark): https://www.figma.com/design/Nq6CEc1vtidU3DpfKIxMRr/Zeeve-App-v2--Copy-?node-id=73-3586&m=dev
- Existing user (Light): https://www.figma.com/design/Nq6CEc1vtidU3DpfKIxMRr/Zeeve-App-v2--Copy-?node-id=73-2264&m=dev
- Existing user (Dark): https://www.figma.com/design/Nq6CEc1vtidU3DpfKIxMRr/Zeeve-App-v2--Copy-?node-id=73-3085&m=dev

#### Verify Locally
```bash
npm run dev
# open http://localhost:3000
npm run lint
npm test -s
npm run build
```

## 3) Application Flows

### Authentication Flow

- User opens `/auth/login`.
- The form calls `POST /api/v1/login` via `authAxiosInstance` with `withCredentials: true` so the backend can set the `refresh_token` cookie (HttpOnly).
- Middleware and logout flows attach the `serviceURL` query parameter so the login page can navigate users back to the exact page they came from once authentication succeeds.
- Immediately after a successful login, the app calls `GET /api/v1/access_token` (or `POST /api/v1/refresh` where applicable) to obtain a fresh access token using the cookie.
- The access token is stored in memory only and set on the Axios instances.
- User is redirected to `/` (dashboard).

### API Request Flow

- All platform API requests are made via the shared Axios instance in `src/providers/axios-provider.tsx`.
- The provider attaches `Authorization: Bearer <access_token>` to every request automatically.
- Example header:
  - `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI...`

### Logout Flow

- Frontend calls `POST ${NEXT_PUBLIC_API_URL}/api/v1/logout` with `withCredentials: true` and no body.
- Backend clears the refresh token HttpOnly cookie.
- Frontend clears the in-memory access token and resets auth/user state.
- User is redirected to `/auth/login`.

### Token Refresh Flow

- Proactive: If the access token is a JWT with an `exp` claim, the provider schedules an automatic refresh ~60s before expiry. If `exp` is not available, it falls back to a 12‑minute timer.
- Reactive: If any API request returns `401`, the provider calls `GET /api/v1/access_token` (or `POST /api/v1/refresh`) once, updates the access token if successful, and retries the original request once.
- Initial: On app load, and right after login, the provider attempts a silent refresh (`GET /api/v1/access_token`) to obtain an access token if a valid `refresh_token` cookie exists.

### Logout Flow

- The header menu triggers `POST /api/v1/logout` to clear the refresh cookie server‑side.
- The app clears the in‑memory access token and redirects to `/auth/login`.

### Error Handling Flow

- If refresh fails (e.g., expired/invalid refresh cookie), subsequent protected requests are redirected to `/auth/login` by the client interceptor.
- Middleware also protects direct navigations by redirecting to `/auth/login` when no refresh cookie is present.

### State Management Flow

- Access token is kept in memory only (`src/utils/auth-token.ts`).
- Auth/UI state uses React Providers and light Zustand stores where needed for user data.
- `useAxios()` exposes a single Axios instance + `setAuthToken()` for consumers.

### Protected Page Flow

- Edge middleware (`src/middleware.ts`) checks for the presence of the refresh cookie on HTML requests.
- When unauthenticated, requests to platform pages are redirected to `/auth/login`.
- On the client, `AuthProvider` only renders children once the app is authenticated/ready; otherwise, it stays inert.

## 4) Setup & Installation

Prerequisites

- Node.js 18+ and npm 9+ (or pnpm/yarn)

Clone & Install

- `git clone <repo>`
- `cd application-front-end-2.0`
- `npm install`

- Environment Variables (`.env.local`)
  - `NEXT_PUBLIC_API_URL=https://odoo-dev.zeeve.net` (Unified API host used for all `/api/*` and `/api/v1/*` calls)
  - `NEXT_PUBLIC_HOST=app.develop.zeeve.io` (optional; used to build absolute URLs for links in emails, banners, etc.)
  - `NEXT_PUBLIC_ENABLE_RECAPTCHA=true` (set to `false`, `0`, or `no` to skip loading Google reCAPTCHA)
  - Other values (host, reCAPTCHA site key, etc.) as needed.
- reCAPTCHA & other settings are already wired; adjust as needed.

### Zoho Desk configuration (account deletion tickets)

The delete‑account flow calls Zoho Desk from `src/app/api/support/delete-account/route.ts`, so the following env vars must be set:

- Required: `ZOHO_DESK_BASE_URL`, `ZOHO_DESK_ORG_ID`, `ZOHO_DESK_DEPARTMENT_ID`.
- Authentication: either provide a long‑lived `ZOHO_DESK_ACCESS_TOKEN` **or** wire the automatic refresh path with `ZOHO_DESK_REFRESH_TOKEN`, `ZOHO_DESK_CLIENT_ID`, and `ZOHO_DESK_CLIENT_SECRET`. Leaving both is fine—the refresh flow will be used first and the static token becomes a fallback.
- Optional: `ZOHO_ACCOUNTS_BASE_URL` only needs to change if your Zoho organization lives on a regional domain such as `https://accounts.zoho.eu`.

Steps to obtain the credentials:

1. Visit https://api-console.zoho.com and create a new **Self Client** (quickest) or **Server-based** client. Copy the `Client ID` and `Client Secret` into the matching env vars.
2. In the same console, click **Generate Code**, choose the scopes `Desk.tickets.CREATE,Desk.contacts.READ` (add more if you plan to read tickets), and generate a one-time grant code.
3. Exchange that grant code for a refresh token (run once):
   ```bash
   curl "https://accounts.zoho.com/oauth/v2/token" \
     -X POST \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "code=GRANT_CODE_FROM_STEP_2" \
     -d "client_id=YOUR_CLIENT_ID" \
     -d "client_secret=YOUR_CLIENT_SECRET" \
     -d "redirect_uri=https://www.zoho.com" \
     -d "grant_type=authorization_code"
   ```
   The JSON response contains `refresh_token` and `access_token`; store `refresh_token` in `ZOHO_DESK_REFRESH_TOKEN`. The backend will automatically mint fresh access tokens when needed.
4. Collect the Zoho Desk identifiers:
   - `ZOHO_DESK_ORG_ID`: shown in the API Console “orgId” header value or in Desk under **Setup → Developer Space → API**.
   - `ZOHO_DESK_DEPARTMENT_ID`: open **Setup → Organization → Departments**, select the department, and copy the ID from the URL or API response.
   - `ZOHO_DESK_BASE_URL`: usually `https://desk.zoho.com/api/v1`; only change when using a regional Desk domain.
5. (Optional) Keep `ZOHO_DESK_ACCESS_TOKEN` populated if you want a manual fallback token; otherwise the refresh credentials are enough.

### Crisp Ticket Center configuration (support tickets)

The in-app Ticket Center uses Crisp's ticket center plugin and requires a server-side secret for HMAC signing:

- Required: `CRISP_TICKET_CENTER_SECRET` (server-only) and `NEXT_PUBLIC_CRISP_WEBSITE_ID`.
- In Crisp Dashboard → Ticket Center plugin:
  - Add your app domain(s) to the allowlist.
  - Paste the `CRISP_TICKET_CENTER_SECRET` value.

Run Locally

- `npm run dev` → http://localhost:3000
- Login page: http://localhost:3000/auth/login

Build

- `npm run build` (warnings are OK). The build must pass with zero errors.

## Deploy flows (platform)

- Unified payload shape used by OP Stack, zkSync and Polygon CDK when calling `/api/v1/rollup/service/deploy`:

```
{
  "type_id": 6,
  "name": "<network name>",
  "region_ids": [1],
  "network_type": "testnet|mainnet",
  "is_demo": false,
  "configuration": {
    "settlement_layer": "Ethereum Sepolia",
    "external_d_a": "OnChainDataAvailability",
    "sequencer": "Centralized",
    "chainId": "1122"
  },
  "core_components": [],
  "nodes": []
}
```

- Deploy actions now show a loading state until the backend responds or the browser redirects, preventing duplicate submissions.
- Redirection after deploy: backend may return `checkout_url` (Stripe absolute URL) or `redirectionUrl` (relative path). Pages detect both and redirect (hard redirect for external URLs).

- Only one Deploy button is shown: the Summary card on the right owns submit; any secondary buttons in the left form are removed to avoid duplicates.

- Landing pages (OP Stack, zkSync, Polygon CDK) are driven by `/api/v1/rollup/services?type=<key>`. Demo card is shown only when a demo service exists; Testnet/Mainnet cards show “View” when deployed; otherwise “Deploy Testnet”/“Contact Us”. Polygon CDK adds a contextual **Info** button linking to Zeeve documentation when a testnet deployment is available.

Validator Nodes list mapping

- The table at `/manage/nodes/validator` now maps fields from the backend response as follows:
  - Protocol → `protocol_name` (shows logo + name)
  - Node Name → `node_name`
  - Node Status → `status`
  - Plan → `plan_type`
  - Next Billing Date → `next_billing_date`
  - Created On → `created_on`

Auth redirects

- Root `/` redirects to `/auth/login` when not authenticated. Any `/login` requests are rewritten to `/auth/login` by `src/middleware.ts`. There is no standalone `/login` page.

### Local HTTPS and Cookie Notes

- The refresh token is set as an HttpOnly cookie with `SameSite=None; Secure`. Browsers require HTTPS to store and send such cookies cross‑site.
- Options for local development:
  - Option A (recommended): Run the frontend over HTTPS so the Secure cookie is accepted by the browser.
    - Generate a local cert (e.g., via mkcert or openssl), place it in `./.cert/localhost.crt` and `./.cert/localhost.key`, then run:
      - `npm run dev:https` → serves `https://localhost:3000`
  - Option B (backend only, for local): Temporarily disable the `secure` flag when the host is `localhost` so cookies can be set from HTTP. Example (Python/Odoo):
    ```py
    secure_flag = not request.host.startswith("localhost")
    response.set_cookie(
        "refresh_token",
        token,
        httponly=True,
        samesite="None",
        secure=secure_flag,  # Secure in prod, False in local
        max_age=3600,
        path="/",
    )
    ```

Also ensure CORS headers allow credentialed requests on the auth backend:

- `Access-Control-Allow-Origin: http://localhost:3000` (exact origin, not `*`)
- `Access-Control-Allow-Credentials: true`
- `Vary: Origin`

## 4) Rollups Integration (backend‑driven)

- Rollup flows are driven by backend APIs:
  - `/api/v1/rollup/services` → determines Demo/Testnet/Mainnet state for a rollup
  - `/api/v1/rollup/configuration?type=<rollupKey>` → provides configuration options (settlement layers, DA layers)
  - `/api/v1/rollup/service/deploy` → deploys the selected rollup
  - Legacy fallback supported: `/api/v1/rollup/types` (used only if `configuration` is unavailable)
- Routes
  - `/rollups` → list
  - `/rollups/:rollupKey` → dashboard cards (Demo/Testnet/Mainnet)
  - `/rollups/:rollupKey/deploy` → generic deploy form (uses `configuration` with fallback to `types`)
  - `/rollups/:rollupKey/network/:id` → details; `arbitrum-orbit` redirects to the existing Orbit details route
- Friendly aliases (same UI): `/opstack`, `/polygon-cdk`, `/zksync` (+ `/deploy` and `/network/:id` under each). Legacy `/platform/...` URLs still rewrite to these flattened routes for compatibility.
  - OP Stack and zkSync pages use dedicated landing cards styled after their original frontends.
  - OP Stack uses dedicated landing and deploy screens styled like the original OP Stack frontend. See `src/app/opstack/*`.

Orbit/OP/zkSync landing specifics

- Sources: Orbit → `src/app/arbitrum-orbit/page-client.tsx`; OP → `src/app/opstack/page-client.tsx`; zkSync → `src/app/zksync/page-client.tsx`
- Backend: `/api/v1/rollup/services?type=<rollupKey>` (Orbit: `arbitrum-orbit`, OP: `opstack`, zkSync: `zksync-hyperchains`)
  - The API returns services with `inputs.extras.is_demo` and `inputs.extras.network_type`.
  - The hook `@orbit/services/rollup/services` now normalizes these to top‑level `is_demo` and `network_type` for convenience.
- Card logic on landing pages:
  - Demo card shows only if a demo service exists (`is_demo: true`) and links to details with `?demo=true`.
  - Testnet card shows:
    - "View" if a non‑demo `network_type: "testnet"` exists (renders as a Network card)
    - "Deploy Testnet" otherwise (renders as the custom Testnet card)
  - Mainnet card shows:
    - "View" if a `network_type: "mainnet"` exists (renders as a Network card with mainnet styling)
    - "Contact Us" otherwise (renders as the custom Mainnet card)
  - When a demo network exists, all three cards are visible (Demo + Testnet + Mainnet).
  - Deploy gating: the deploy button is disabled when a user already has a Testnet or Mainnet.

Implementation notes

- Common fetcher: `src/services/rollups/services-by-type.ts` normalizes `inputs.extras.is_demo/isdemo` and `inputs.extras.network_type` into top‑level fields for all rollups.
- OP Stack deployed card: `src/app/opstack/_components/deployed-network-card.tsx`
- zkSync deployed card: `src/app/zksync/_components/deployed-network-card.tsx`
- Deploy pages: Orbit no longer calls network overview on deploy (prefill removed). OP Stack/zkSync show an "Alt DA" badge area populated from configuration items marked `comming_soon`/`coming_soon`.

Notes

- The Arbitrum Orbit area no longer mounts a nested layout/provider that duplicated the global Header/Sidebar. See `src/app/arbitrum-orbit/layout.tsx`.
- A lightweight regression test ensures only one `.sidebar` and one `.app-header` render: `__tests__/layout-regression.test.tsx`.
- Orbit modules now use the app‑wide Axios defaults so token refresh and baseURL logic are consistent.

## 5) Development Notes

- Token lifetimes
  - Access token is assumed short‑lived (≈15m). If the token is a JWT, we use `exp` to schedule refresh. Otherwise, the fallback refresh is ~12m.
  - Refresh token lifetime (≈1h) is defined by the backend; it’s an HttpOnly cookie.

- Adding new protected pages
  - Place pages under app routes (e.g., `src/app/manage/...`) and rely on middleware + client provider guard.
  - Use `useAxios()` for API calls so the `Authorization` header and refresh logic are automatic.

## Node Details (Restored)

- Full Nodes and Archive Nodes
  - Details pages render General Info and embed the Vizion dashboard via an iframe.
  - Files: `src/app/manage/nodes/full/[id]/page-client.tsx`, `src/app/manage/nodes/archive/[id]/page-client.tsx`.
  - The iframe origin is controlled by `NEXT_PUBLIC_IFRAME_ORIGIN` (set to `https://vizion.zeeve.net`) and `NEXT_PUBLIC_IFRAME_SCRIPT_ORIGIN`.
  - The detail pages do not rely on lightweight query params and always fetch full details from the platform API.

- Validator Nodes
  - Per‑protocol dashboards are restored. The page selects a protocol‑specific UI through `RenderProtocol`.
  - File: `src/app/manage/nodes/validator/[id]/page-client.tsx`.
  - Some protocols (e.g., Coreum) include extra Vizion data (validator details, node details, restake info).

Navigation

- The sidebar entries link to `/manage/nodes/full`, `/manage/nodes/archive`, and `/manage/nodes/validator`.
- Each table row’s action navigates to the corresponding `[id]` page with `?protocolId=<id>`; the pages fetch and render full UI.

- Role‑based access control (RBAC)
  - Add role checks to the user bootstrap flow (after `user-info` is fetched) and branch UI/route access accordingly.

- Interop with non‑platform requests
  - The global axios default `Authorization` header is set alongside the scoped instance to cover modules that import `axios` directly. Prefer `useAxios()` for platform API calls.

Fixes

- Fixed an issue where successful login sometimes redirected to `/auth/register`. Now successful login performs a refresh and redirects to `/`.

## 6) Future Enhancements

- SSR auth with session hydration for seamless first paint
- BroadcastChannel/localStorage events to keep access token in sync across tabs without persisting the token
- Finer‑grained retry/backoff for network errors
- Unit tests for interceptors, refresh race handling, and routing guards
- RBAC enforcement components and route segment guards
- Optional Web Crypto storage (ephemeral) for in‑memory token obfuscation

---

## Key Implementation References

- Login flow: `src/app/auth/login/[[...slug]]/page-client.tsx`
- Axios configuration & refresh: `src/providers/axios-provider.tsx`, `src/utils/auth-axios.ts`
- In‑memory access token store: `src/utils/auth-token.ts`
- Logout integration: `src/providers/layout-provider/header.tsx`
- Auth guard (client): `src/providers/auth-provider.tsx`
- Middleware (edge guard): `src/middleware.ts`
