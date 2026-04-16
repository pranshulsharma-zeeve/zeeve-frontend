const API_BASE_PATH = "/api/v1" as const;

const withApiBasePath = (path: string): string => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_PATH}${normalized}`;
};

export { API_BASE_PATH, withApiBasePath };
