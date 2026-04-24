// src/api/client.js

const BASE_URL = import.meta.env.VITE_API_URL || 'https://dopamine-treasure-backend-production.up.railway.app'

async function request(endpoint, options = {}) {
  const isFormData = options.body instanceof FormData

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
  })

  const data = await res.json()
  if (!res.ok) {
    console.log('서버 응답 status:', res.status)
    console.log('서버 응답 data:', data)
    throw new Error(data.message || '서버 오류가 발생했어요')}
  return data
}

export const client = {
  get:      (url)           => request(url),
  post:     (url, body)     => request(url, { method: 'POST',  body: JSON.stringify(body) }),
  postForm: (url, formData) => request(url, { method: 'POST',  body: formData }),
  patch:    (url, body)     => request(url, { method: 'PATCH', body: JSON.stringify(body) }),
}