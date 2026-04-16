import { useContext, useMemo } from "react";
import axios from "axios";
import { AxiosContext } from "@/providers/axios-provider";

const useAxios = () => {
  const axiosContext = useContext(AxiosContext);

  const backendAxiosInstance = useMemo(() => {
    return axiosContext?.backendAxiosInstance ?? axios;
  }, [axiosContext?.backendAxiosInstance]);

  return {
    backendAxiosInstance,
  };
};

export default useAxios;
