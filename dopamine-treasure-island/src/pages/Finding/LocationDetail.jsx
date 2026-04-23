import { useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { getLocation } from '@/api'

export default function LocationDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { state } = useLocation()

  useEffect(() => {
    const userInfo = state?.userInfo || JSON.parse(localStorage.getItem('userInfo')) || {}
    console.log('student_id 타입:', typeof userInfo?.student_id)
console.log('student_id 값:', userInfo?.student_id)
   
    getLocation(id, userInfo?.student_id)
      .then((data) => {
        console.log('location data:', data)  // ← 추가
        console.log('is_own:', data.is_own)  // ← 추가
        if (data.is_own){
          alert('내가 숨긴 보물이에요! 다른 장소를 탐험해보세요')
          navigate(-1)
          return
        }
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