import { loadJson } from "./loadJson";
import { resolveBaseUrl } from "./mapAssets";

export const loadAssets = async ({
  cacheKey,
  importer,
  mapItem,
  baseEnvKey,
  baseFallback = "",
}) => {
  const data = await loadJson(cacheKey, importer);
  if (!mapItem) return data;
  const baseURL = baseEnvKey ? resolveBaseUrl(baseEnvKey, baseFallback) : "";
  return data.map((item) => mapItem(item, baseURL));
};
