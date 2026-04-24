import { useNavigate, useLocation } from 'react-router-dom'
import '@/styles/Hide.css'
import back from '@/assets/img/back.png'

const MISSION_TYPES = [
  { type: 'quiz',  label: '퀴즈형 미션' },
  { type: 'photo', label: '사진촬영 미션(기프티콘 등록 필수!)' },
]

export default function HideSelectMission() {
  const navigate = useNavigate()
  const { state } = useLocation()

  function selectMission(missionType) {
    navigate('/hide/mission-detail', {
      state: { ...state, missionType },
    })
  }

  return (
    <div className="container">
      <button className="sh-back-btn" onClick={() => navigate('/')}>
        <img src={back} alt="뒤로 가기" />
      </button>

      <h2>미션 유형 선택</h2>

      {MISSION_TYPES.map(({ type, label }) => (
        <button
          key={type}
          className="type-btn"
          onClick={() => selectMission(type)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
