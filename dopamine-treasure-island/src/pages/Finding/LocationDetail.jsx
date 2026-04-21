import { useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { getLocation } from '@/api'

export default function LocationDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { state } = useLocation()

  useEffect(() => {
    getLocation(id)
      .then((data) => {
        if (!data.mission_type) {
          alert('이 장소에는 보물이 없어요!')
          navigate(-1)
          return
        }
        if (data.mission_type === 'quiz') {
          navigate(`/missions/${id}/quiz`, { state: { ...state, locationData: data } })
        } else if (data.mission_type === 'photo') {
          navigate(`/missions/${id}/photo`, { state: { ...state, locationData: data } })
        }
      })
      .catch(() => {
        alert('장소 정보를 불러오지 못했어요.')
        navigate(-1)
      })
  }, [id])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>미션 불러오는 중...</p>
    </div>
  )
}