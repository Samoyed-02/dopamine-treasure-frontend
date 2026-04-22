import { client } from './client'

// ─── 보물 찾기 ─────────────────────────────────────────────────
export const verifyMission = (locationId, formData) =>
  client.postForm(`/locations/${locationId}/verify`, formData)

// api/index.js 예시
export const claimTreasure = async (location_id, data) => {
  const response = await axios.post(`${BASE_URL}/locations/${location_id}/claim`, data);
  return response.data;
};
// ─── 보물 숨기기 ───────────────────────────────────────────────
export const hideTreasure = (formData) =>
  client.postForm('/treasures', formData)