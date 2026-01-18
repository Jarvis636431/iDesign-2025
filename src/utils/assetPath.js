export const normalizeBase = (base, fallback = "") => {
  const value = base || fallback || "";
  if (!value) return "";
  return value.endsWith("/") ? value : `${value}/`;
};

export const joinBase = (base, path) => {
  if (!path) return path;
  if (path.startsWith("http")) return path;
  const sanitized = path.replace(/^\//, "");
  return `${base}${sanitized}`;
};
