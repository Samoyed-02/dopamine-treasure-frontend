import { client } from './client'

// ─── 보물 찾기 ─────────────────────────────────────────────────
export const verifyMission = (locationId, formData) =>
  client.postForm(`/locations/${locationId}/verify`, formData)

export const claimTreasure = (locationId, studentId) => {
  const formData = new FormData()
  formData.append('student_id', studentId)
  return client.postForm(`/locations/${locationId}/claim`, formData)
}
// ─── 보물 숨기기 ───────────────────────────────────────────────
export const hideTreasure = (formData) =>
  client.postForm('/treasures', formData)