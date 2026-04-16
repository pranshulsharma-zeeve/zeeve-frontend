import useAlertListAPI from "./alert/list";

/** hook to use oas service */
const useOASService = () => {
  return {
    alert: {
      list: useAlertListAPI,
    },
  };
};

export default useOASService;
