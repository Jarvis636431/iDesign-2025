import { normalizeBase, joinBase } from "./assetPath";

export const mapHallAssets = (hall, baseURL) => ({
  ...hall,
  icon: joinBase(baseURL, hall.icon),
  logo: joinBase(baseURL, hall.logo),
  border: joinBase(baseURL, hall.border),
  mobileBorder: joinBase(baseURL, hall.mobileBorder),
  backgroundImage: joinBase(baseURL, hall.backgroundImage),
});

export const mapGraduateAssets = (graduate, baseURL) => ({
  ...graduate,
  avatar: joinBase(baseURL, graduate.avatar),
});

export const mapStaffGroupAssets = (group, baseURL) => ({
  ...group,
  members: group.members.map((member) => ({
    ...member,
    avatar: joinBase(baseURL, member.avatar),
  })),
});

export const resolveBaseUrl = (envKey, fallback = "") => {
  const raw = import.meta.env[envKey];
  return normalizeBase(raw || fallback || "", fallback);
};
