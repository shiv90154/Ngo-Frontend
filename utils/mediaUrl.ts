// utils/mediaUrl.ts

// API calls go to /api, but static media is served from the server root
const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_MEDIA_URL || "http://localhost:5000";

export const getMediaUrl = (url: string) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${MEDIA_BASE_URL}${url}`;
}; 