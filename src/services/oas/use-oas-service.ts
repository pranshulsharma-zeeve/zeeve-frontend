import useAlertListAPI from "./alert/list";

const useOASService = () => {
  return {
    alert: {
      list: useAlertListAPI,
    },
  };
};

export default useOASService;
