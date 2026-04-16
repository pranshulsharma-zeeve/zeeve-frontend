"use client";
import { useContext, useMemo } from "react";
import axios from "axios";
import { AxiosContext } from "@/providers/axios-provider";
import { clearAccessToken, storeAccessToken } from "@/utils/auth-token";

const useAxios = () => {
  const axiosContext = useContext(AxiosContext);

  const backendAxiosInstance = useMemo(() => {
    return axiosContext?.backendAxiosInstance ?? axios;
  }, [axiosContext?.backendAxiosInstance]);

  const setAuthToken = useMemo(() => {
    if (axiosContext?.setAuthToken) {
      return axiosContext.setAuthToken;
    }

    return (token: string | null) => {
      if (token) {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        storeAccessToken(token);
      } else {
        delete axios.defaults.headers.common.Authorization;
        clearAccessToken();
      }
    };
  }, [axiosContext?.setAuthToken]);

  return {
    backendAxiosInstance,
    setAuthToken,
  };
};

export default useAxios;
