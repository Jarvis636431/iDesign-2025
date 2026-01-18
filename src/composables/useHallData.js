import { computed, ref } from "vue";
import { mapHallAssets } from "../utils/mapAssets";
import { loadAssets } from "../utils/loadAssets";

export const useHallData = (route, tm) => {
  const halls = ref([]);

  const currentHallId = computed(() => Number(route.query.id) || 73);

  const currentHallInfo = computed(() => {
    return halls.value.find((hall) => hall.id === currentHallId.value) || null;
  });

  const formatDesc = (hall) => {
    if (!hall) return [];
    const desc = tm(`halls.${hall.i18nKey}.desc`);
    return Array.isArray(desc) ? desc : desc ? [desc] : [];
  };

  const loadHalls = async () => {
    if (halls.value.length) return halls.value;
    halls.value = await loadAssets({
      cacheKey: "halls",
      importer: () => import("../constants/halls.json"),
      mapItem: mapHallAssets,
      baseEnvKey: "BASE_URL",
      baseFallback: "/",
    });
    return halls.value;
  };

  return {
    halls,
    currentHallId,
    currentHallInfo,
    formatDesc,
    loadHalls,
  };
};
