import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLocations } from '@/api'
import '@/styles/Find.css'
import LocationCard from '@/components/LocationCard'
import '@/components/LocationCard.css'
import back from '@/assets/img/back.png'
import logoImg from '@/assets/img/bennerminilogo.png'
import { LOCATION_META } from '@/constants/locationMeta'
import campusImg from '@/assets/img/campus.png'

const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY
const BASE_URL = 'https://dopamine-treasure-backend-production.up.railway.app'

export default function LocationList() {
  const navigate = useNavigate()
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 장소 목록 불러오기
  useEffect(() => {
    getLocations()
      .then((data) => setLocations(Array.isArray(data) ? data : data.locations || []))
      .catch(() => setError('장소 정보를 불러오지 못했어요 😢'))
      .finally(() => setLoading(false))
  }, [])

  // pending + 30분 제한 동기화
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (!userInfo?.student_id) return

    fetch(`${BASE_URL}/my-pending?student_id=${userInfo.student_id}`)
      .then((res) => res.json())
      .then((data) => {
        // pending 동기화
        if (data.pending) {
          localStorage.setItem('pendingMission', 'true')
        } else {
          localStorage.removeItem('pendingMission')
        }

        // 30분 제한 동기화 (관리자 승인 시)
        if (data.limited) {
          const limitUntil = new Date(Date.now() + 30 * 60 * 1000).toISOString()
          localStorage.setItem('missionLimitUntil', limitUntil)
        }
      })
      .catch(() => {})
  }, [])

  // 장소 클릭 공통 핸들러
  function handleLocationClick(locId) {
    const isPending = localStorage.getItem('pendingMission') === 'true'
    if (isPending) {
      alert('사진 미션 승인 대기 중이에요!\n관리자 승인 후 다시 도전해보세요 🎁')
      return
    }

    const limitUntil = localStorage.getItem('missionLimitUntil')
    if (limitUntil && new Date() < new Date(limitUntil)) {
      const remaining = Math.ceil((new Date(limitUntil) - new Date()) / 60000)
      alert(`30분 동안 미션 참여가 제한됩니다!\n약 ${remaining}분 후에 다시 도전해보세요 🎁`)
      return
    }

    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    navigate('/locations/' + locId, { state: { userInfo } })
  }

  // 카카오맵 초기화
  useEffect(() => {
    if (loading || !mapRef.current) return

    function initMap() {
      const { kakao } = window
      kakao.maps.load(() => {
        const center = new kakao.maps.LatLng(37.2445, 127.0357)
        const map = new kakao.maps.Map(mapRef.current, { center, level: 4 })
        mapInstanceRef.current = map

        locations.forEach((loc) => {
          const coords = LOCATION_META[loc.name]
          if (!coords) return

          const position = new kakao.maps.LatLng(coords.lat, coords.lng)
          const marker = new kakao.maps.Marker({ position, map })
          const infoContent = `<div style="padding:6px 10px;font-size:13px;font-weight:700;color:#FF6B35;white-space:nowrap;">${loc.name} 🎁${loc.treasure_count}</div>`
          const infoWindow = new kakao.maps.InfoWindow({ content: infoContent, removable: false })

          kakao.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(map, marker)
            handleLocationClick(loc.id)
          })
        })
      })
    }

    if (window.kakao?.maps) {
      initMap()
    } else {
      const script = document.createElement('script')
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false`
      script.onload = initMap
      document.head.appendChild(script)
    }
  }, [loading, locations, navigate])

  return (
    <div className="page">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <img src={back} alt="뒤로가기" />
        </button>
        <div className="logo-container">
          <img src={logoImg} className="logo" alt="로고" />
        </div>
      </header>

      <main className="main-content">
        <h2 className="map-title">수원대 실시간 보물맵</h2>
        <img src={campusImg} alt="수원대 캠퍼스 지도" style={{ width: '100%', borderRadius: '12px' }} />
        <h3 className="status-title">실시간 잔여 보물 현황</h3>

        {loading && (
          <div className="loading-wrap">
            <div className="spinner" />
            <p>보물 현황 불러오는 중...</p>
          </div>
        )}
        {error && <p className="error-msg">{error}</p>}
        {!loading && !error && (
          <div className="loc-grid">
            {locations.map((loc) => (
              <LocationCard
                key={loc.id}
                loc={loc}
                selected={false}
                onClick={() => handleLocationClick(loc.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}