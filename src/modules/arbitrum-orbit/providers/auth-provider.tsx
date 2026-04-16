"use client";
import React, { useCallback, useEffect, useState } from "react";
import TokenManager from "@zeeve-platform/login-utility";
import { useUserStore } from "@orbit/store/user";
import usePlatformService from "@orbit/services/platform/use-platform-service";
import { getConfig } from "@/config";
import { backendAxiosInstance } from "@orbit/utils/axios";
import ROUTES from "@orbit/routes";

interface AuthProviderProps extends React.PropsWithChildren {}

/** AuthProvider. */
const AuthProvider = (props: AuthProviderProps) => {
  const { children } = props;
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const config = getConfig();
  const setUser = useUserStore((state) => state.setUser);

  const environment = config.environment;
  const authBackendURL = config.url?.external?.auth?.backend;
  const authFrontendURL = config.url?.external?.auth?.frontend;

  /** create and initialize token manager */
  const initializeAuth = useCallback(async () => {
    try {
      await TokenManager.createInstance(authBackendURL as string, backendAxiosInstance);
      setIsAuthenticated(true);
    } catch (error) {
      console.log(error);
      setIsAuthenticated(false);
      window.open(`${authFrontendURL}${ROUTES.AUTH.PAGE.LOGIN}`);
    }
  }, [authBackendURL, authFrontendURL]);

  const {
    request: { data: userData, error: userError },
  } = usePlatformService().dashboard.userInfo(isAuthenticated);

  if (userData) {
    setUser(userData.data);
  }

  if (userError) {
    setUser(null);
  }

  useEffect(() => {
    // if on local do not initialize auth
    if (environment === "local") {
      setIsAuthenticated(true);
    } else {
      initializeAuth();
    }
  }, [initializeAuth, environment]);

  return isAuthenticated ? <>{children}</> : null;
};

export default AuthProvider;
