import { ReactNode } from "react";
import OrbitModalProvider from "@orbit/providers/modal-provider";

/**
 * Arbitrum Orbit area layout.
 *
 * Note: Global app providers (Auth, Axios, App Layout with Header/Sidebar) are
 * already mounted in src/app/layout.tsx. To avoid double header/sidebar issues
 * we do not render Orbit's custom Layout or Auth providers here.
 *
 * We only register Orbit-specific modals so existing flows keep working.
 */
const ArbitrumOrbitLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <OrbitModalProvider />
      {children}
    </>
  );
};

export default ArbitrumOrbitLayout;
