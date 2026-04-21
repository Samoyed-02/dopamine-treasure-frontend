// ─── 설정 ──────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || 'https://dopamine-treasure-backend-production.up.railway.app'

// ─── 공통 요청 함수 ────────────────────────────────────────────
async function request(endpoint, options = {}) {
  const isFormData = options.body instanceof FormData

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || '서버 오류가 발생했어요')
  return data
}

// 메서드 헬퍼
const get  = (url)          => request(url)
const post = (url, body)    => request(url, { method: 'POST',  body: JSON.stringify(body) })
const postForm = (url, formData) => request(url, { method: 'POST',  body: formData })
const patch = (url, body)   => request(url, { method: 'PATCH', body: JSON.stringify(body) })

// ─── 장소 ──────────────────────────────────────────────────────
export const getLocations = ()     => get('/locations')
export const getLocation  = (id)   => get(`/locations/${id}`)

// ─── 보물 찾기 ─────────────────────────────────────────────────
export const verifyMission  = (locationId, formData) => postForm(`/locations/${locationId}/verify`, formData)
export const claimTreasure  = (locationId, studentId) => post(`/locations/${locationId}/claim`, { student_id: studentId })

// ─── 보물 숨기기 ───────────────────────────────────────────────
export const hideTreasure = (formData) => postForm('/treasures', formData)

// ─── 관리자 ────────────────────────────────────────────────────
export const adminLogin        = (password)        => post('/admin/login', { password })
export const getAdminLocations = ()                => get('/admin/locations')
export const getAdminTreasures = (page = 1, status = '') =>
  get(`/admin/treasures?page=${page}${status ? `&status=${status}` : ''}`)
export const getAdminAttempts  = ()                => get('/admin/attempts')
export const getAdminClaims    = ()                => get('/admin/claims')
export const getAdminStats     = ()                => get('/admin/stats')
export const patchAttempt      = (id, status)      => patch(`/admin/attempts/${id}`, { status })
export const patchTreasure     = (id, payload)     => patch(`/admin/treasures/${id}`, payload)