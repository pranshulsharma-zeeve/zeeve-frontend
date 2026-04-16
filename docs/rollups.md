# Rollups Integration

The app uses backend‑driven APIs for rollups to keep UX consistent and reduce duplication.

- Services API: `/api/v1/rollup/services` → indicates whether Demo/Testnet/Mainnet exist and provides IDs to open details.
- Configuration API: `/api/v1/rollup/configuration?type=<rollupKey>` → returns configuration options (settlement layers, DA layers) used by the deploy form.
- Deploy API: `/api/v1/rollup/service/deploy` → creates a new rollup deployment.

## Routes

- `/rollups` → list
- `/rollups/:rollupKey` → cards for Demo/Testnet/Mainnet
- `/rollups/:rollupKey/deploy` → generic deploy form (uses `configuration`, with fallback to `types` if not present)
- `/rollups/:rollupKey/network/:id` → details; for Orbit, the route redirects to the existing `arbitrum-orbit/network/:id` page to preserve current UX.

## Implementation Notes

- Hooks live at `src/services/rollups/use-rollup-service.ts`.
- The rollup landing cards component is implemented directly in `src/app/rollups/[rollupKey]/page-client.tsx` and uses shared components (`PageHeader`, `SectionCard`).
- Deploy form is standardized across rollups; options come from the Configuration API; submission goes to the Deploy API.
- Friendly alias routes are available for some rollups: `/opstack`, `/polygon-cdk`, `/zksync` (including `/deploy` and `/network/:id`). `zksync` maps internally to key `zksync-hyperchains`. OP Stack uses a dedicated landing and deploy UI under `src/app/opstack/*` that renders with the same backend APIs.
- As dedicated designs for OP Stack / Polygon CDK / zkSync Hyperchains are added, replace the generic details shell in `network/:id` for those keys.
