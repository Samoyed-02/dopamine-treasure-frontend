import { client } from './client'

// ─── 관리자 ────────────────────────────────────────────────────
export const adminLogin        = (password)             => client.post('/admin/login', { password })
export const getAdminLocations = ()                     => client.get('/admin/locations')
export const getAdminTreasures = (page = 1, status = '') =>
  client.get(`/admin/treasures?page=${page}${status ? `&status=${status}` : ''}`)
export const getAdminAttempts  = ()                     => client.get('/admin/attempts')
export const getAdminClaims    = ()                     => client.get('/admin/claims')
export const getAdminStats     = ()                     => client.get('/admin/stats')
export const patchAttempt = (id, payload) => client.patch(`/admin/attempts/${id}`, payload)
export const patchTreasure     = (id, payload)          => client.patch(`/admin/treasures/${id}`, payload)