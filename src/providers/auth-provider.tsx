"use client";
import React, { useCallback, useEffect, useState } from "react";
import useAxios from "@/hooks/use-axios";
import { useUserStore } from "@/store/user";
import usePlatformService from "@/services/platform/use-platform-service";
import { useVisionUserStore } from "@/store/vizionUser";
import { getStoredAccessToken, onAccessTokenChange } from "@/utils/auth-token";
import ZeeveLoader from "@/components/shared/ZeeveLoader";
import useIsAuthRoute from "@/hooks/use-is-auth-route";

interface AuthProviderProps extends React.PropsWithChildren {
  frontendURL: string;
  backendURL?: string;
}

const AuthLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-[rgba(10,15,35,0.03)]">
    <ZeeveLoader label="Preparing your workspace..." />
  </div>
);

/** AuthProvider. */
const AuthProvider = (props: AuthProviderProps) => {
  const { children } = props;
  const [authState, setAuthState] = useState<"idle" | "checking" | "authenticated" | "unauthenticated">("idle");
  const isAuthRoute = useIsAuthRoute();

  const { setAuthToken } = useAxios();
  const setUser = useUserStore((state) => state.setUser);
  const setVisionUser = useVisionUserStore((state) => state.setVisionUser);
  const [isVisionReady, setVisionReady] = useState(false);

  /** create and initialize token manager */
  const {
    request: { data: userData, error: userError },
  } = usePlatformService().dashboard.userInfo(authState === "authenticated");

  const { request, url } = usePlatformService().vizion.vizionLogin();

  const loginWithEmail = useCallback(
    async (username: string) => {
      const payload = { username };
      const response = await request(url, payload);

      if (response?.data?.success && response?.data?.data?.success) {
        const visionUserData = response?.data?.data;

        // Modify hostData for singleMachine items
        if (visionUserData.hostData && Array.isArray(visionUserData.hostData)) {
          visionUserData.hostData = visionUserData.hostData.map((host) => {
            if (host.singleMachine) {
              return {
                ...host,
                RPC: [host.primaryHost],
                Bridge: [host.primaryHost],
                Explorer: [host.primaryHost],
                Prover: [host.primaryHost],
                Backup: [host.primaryHost],
                Core: [host.primaryHost],
              };
            }
            return host;
          });
        }
        setVisionUser(visionUserData);
      } else {
        setVisionUser(null);
      }
    },
    [request, setVisionUser, url],
  );

  useEffect(() => {
    if (isAuthRoute) {
      setAuthState("unauthenticated");
      setVisionReady(true);
      return;
    }

    let unsubscribe = () => {};
    const existingToken = getStoredAccessToken();

    if (existingToken) {
      setAuthToken(existingToken);
      setAuthState("authenticated");
      setVisionReady(true);
    } else {
      setAuthState("checking");
      unsubscribe = onAccessTokenChange((token) => {
        if (token) {
          setAuthToken(token);
          setAuthState("authenticated");
          setVisionReady(true);
        } else {
          setAuthState("unauthenticated");
          setVisionReady(true);
        }
      });
    }

    return () => {
      unsubscribe();
    };
  }, [isAuthRoute, setAuthToken]);

  useEffect(() => {
    if (isAuthRoute || authState !== "authenticated" || !userData) {
      return;
    }

    setUser(userData.data);

    const doLogin = async () => {
      if (userData.data.usercred) {
        await loginWithEmail(userData.data.usercred);
      }
      setVisionReady(true);
    };

    void doLogin();
  }, [authState, isAuthRoute, loginWithEmail, setUser, userData]);

  useEffect(() => {
    if (isAuthRoute || !userError) {
      return;
    }

    setUser(null);
    setVisionUser(null);
    setVisionReady(true);
  }, [isAuthRoute, setUser, setVisionUser, userError]);

  if (isAuthRoute) {
    return <>{children}</>;
  }

  const canRender = authState === "authenticated" && isVisionReady;

  return canRender ? <>{children}</> : <AuthLoader />;
};

export default AuthProvider;
