const jsonCache = new Map();

export const loadJson = async (cacheKey, importer) => {
  if (jsonCache.has(cacheKey)) {
    return jsonCache.get(cacheKey);
  }
  const { default: data } = await importer();
  jsonCache.set(cacheKey, data);
  return data;
};
