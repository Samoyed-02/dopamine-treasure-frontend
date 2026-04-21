import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getLocations } from '@/api'
import LocationCard from '@/components/LocationCard'
import '@/components/LocationCard.css'
import '@/styles/Hide.css'
import back from '@/assets/img/back.png'

export default function HideSelectLocation() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    console.log('state 확인:', state)
    console.log('userInfo 확인:', state?.userInfo)
    getLocations()
      .then((data) => setLocations(Array.isArray(data) ? data : data.locations || []))
      .catch(() => alert('장소 목록을 불러오지 못했어요.'))
      .finally(() => setLoading(false))
  }, [])

  function handleNext() {
    if (!selectedId) {
      alert('장소를 선택해주세요!')
      return
    }
    const selectedLocation = locations.find((l) => l.id === selectedId)
    navigate('/hide/mission', {
      state: {
        ...state,
        locationId: selectedId,
        locationName: selectedLocation?.name,
      },
    })
  }

  return (
    <div className="sh-container">
      <button className="sh-back-btn" onClick={() => navigate(-1)}>
        <img src={back} alt="뒤로 가기" />
      </button>

      <h2 className="sh-title">
        보물 숨길 장소 선택하기
        <br />
        <span className="sh-subtitle">(장소 10곳 중 1곳 선택)</span>
      </h2>

      {loading && (
        <div className="loading-wrap">
          <div className="sh-spinner" />
          <p>장소 불러오는 중...</p>
        </div>
      )}

      {/* ← 여기가 바뀐 부분 */}
      <div className="loc-grid">
        {locations.map((loc) => (
          <LocationCard
            key={loc.id}
            loc={loc}
            selected={selectedId === loc.id}
            onClick={(loc) => setSelectedId(loc.id)}
          />
        ))}
      </div>

      <button className="sh-btn-next" onClick={handleNext}>
        미션 정하러 가기
      </button>
    </div>
  )
}