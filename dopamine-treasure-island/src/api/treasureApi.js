import { client } from './client'

// ─── 보물 찾기 ─────────────────────────────────────────────────
export const verifyMission = (locationId, formData) =>
  client.postForm(`/locations/${locationId}/verify`, formData)

export const claimTreasure = (locationId, studentId) =>
  client.post(`/locations/${locationId}/claim`, { student_id: studentId })

// ─── 보물 숨기기 ───────────────────────────────────────────────
export const hideTreasure = (formData) =>
  client.postForm('/treasures', formData)