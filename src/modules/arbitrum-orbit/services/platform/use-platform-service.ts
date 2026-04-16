import useRegionListAPI from "./cloud/region-list";
import useUserInfoAPI from "./dashboard/user-info";

/** hook to use platform service */
const usePlatformService = () => {
  return {
    dashboard: {
      userInfo: useUserInfoAPI,
    },
    cloud: {
      regionList: useRegionListAPI,
    },
  };
};

export default usePlatformService;
