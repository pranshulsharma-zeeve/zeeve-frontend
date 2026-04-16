"use client";
import React, { PropsWithChildren, createContext, useMemo, useRef } from "react";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

interface AxiosProviderProps extends PropsWithChildren {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  backendAxiosRequestConfig?: AxiosRequestConfig<any>;
}

const AxiosContext = createContext<{
  backendAxiosInstance: AxiosInstance;
} | null>(null);
AxiosContext.displayName = "AxiosContext";
const AxiosContextProvider = AxiosContext.Provider;

const AxiosProvider = (props: AxiosProviderProps) => {
  const { children, backendAxiosRequestConfig } = props;

  const backendAxiosInstanceRef = useRef(axios.create(backendAxiosRequestConfig));

  const values = useMemo(() => {
    return {
      backendAxiosInstance: backendAxiosInstanceRef.current,
    };
  }, []);

  return <AxiosContextProvider value={values}>{children}</AxiosContextProvider>;
};

export { AxiosContext };
export default AxiosProvider;
