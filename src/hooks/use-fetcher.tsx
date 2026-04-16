"use client";
import useAxios from "./use-axios";

const useFetcher = () => {
  const { backendAxiosInstance } = useAxios();
  const fetcher = (url: string) => backendAxiosInstance.get(url).then((res) => res.data);

  return fetcher;
};

export default useFetcher;
