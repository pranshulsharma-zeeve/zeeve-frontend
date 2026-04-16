import { backendAxiosInstance } from "@orbit/utils/axios";

const useFetcher = () => {
  const fetcher = (url: string) => backendAxiosInstance.get(url).then((res) => res.data);
  return fetcher;
};

export default useFetcher;
