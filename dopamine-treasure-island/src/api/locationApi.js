import { client } from './client'

// ─── 장소 ──────────────────────────────────────────────────────
export const getLocations = ()   => client.get('/locations')
export const getLocation = (id, studentId) => {
  console.log('API 호출 URL:', `/locations/${id}${studentId ? `?student_id=${studentId}` : ''}`)
  return client.get(`/locations/${id}${studentId ? `?student_id=${studentId}` : ''}`)
}