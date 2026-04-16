import useDashboardUrlsAPI from "./dashboard-urls";

/** hook to use analytics service */
const useAnalyticsService = () => {
  return {
    dashboardUrls: useDashboardUrlsAPI,
  };
};

export default useAnalyticsService;
