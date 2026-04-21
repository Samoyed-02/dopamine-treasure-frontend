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

export default function LocationList() {
  const navigate = useNavigate()
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getLocations()
      .then((data) => setLocations(Array.isArray(data) ? data : data.locations || []))
      .catch(() => setError('장소 정보를 불러오지 못했어요 😢'))
      .finally(() => setLoading(false))
  }, [])

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
          const infoContent = '<div style="padding:6px 10px;font-size:13px;font-weight:700;color:#FF6B35;white-space:nowrap;">' + loc.name + ' 🎁' + loc.treasure_count + '</div>'
          const infoWindow = new kakao.maps.InfoWindow({ content: infoContent, removable: false })
          kakao.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(map, marker)
            const userInfo = JSON.parse(localStorage.getItem('userInfo'))
            navigate('/locations/' + loc.id, { state: { userInfo } })
          })
        })
      })
    }
    if (window.kakao?.maps) {
      initMap()
    } else {
      const script = document.createElement('script')
      script.src = 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=' + KAKAO_APP_KEY + '&autoload=false'
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
        {loading && <div className="loading-wrap"><div className="spinner" /><p>보물 현황 불러오는 중...</p></div>}
        {error && <p className="error-msg">{error}</p>}
        {!loading && !error && (
          <div className="loc-grid">
            {locations.map((loc) => (
              <LocationCard
                key={loc.id}
                loc={loc}
                selected={false}
                onClick={(loc) => {
                  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
                  navigate('/locations/' + loc.id, { state: { userInfo } })
                }}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
