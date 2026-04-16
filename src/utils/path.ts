const normalizeBasePath = (basePath?: string | null): string => {
  if (!basePath) {
    return "";
  }
  const normalized = basePath.startsWith("/") ? basePath : `/${basePath}`;
  const trimmed = normalized.replace(/\/$/, "");
  return trimmed === "/" ? "" : trimmed;
};

const getNormalizedEnvBasePath = (): string => {
  return normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH ?? "");
};

const getPreferredBasePath = (): string => {
  return getNormalizedEnvBasePath();
};

const getBasePathCandidates = (): string[] => {
  const preferred = getPreferredBasePath();
  const candidates = new Set<string>();
  if (preferred) {
    candidates.add(preferred);
  }
  candidates.add("/platform");
  return Array.from(candidates);
};

const stripBasePath = (pathname: string, basePath: string): string => {
  if (!basePath || basePath === "/") {
    return pathname;
  }

  if (!pathname.startsWith(basePath)) {
    return pathname;
  }

  const stripped = pathname.slice(basePath.length);
  if (!stripped) {
    return "/";
  }
  return stripped.startsWith("/") ? stripped : `/${stripped}`;
};

const normalizePathname = (pathname: string): string => {
  return getBasePathCandidates().reduce<string>((current, base) => stripBasePath(current, base), pathname);
};

export {
  getPreferredBasePath,
  normalizeBasePath,
  normalizePathname,
  stripBasePath,
  getBasePathCandidates,
  getNormalizedEnvBasePath,
};
