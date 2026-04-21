import { useNavigate, useLocation } from 'react-router-dom'
import '@/styles/Hide.css'
import back from '@/assets/img/back.png'

const TREASURE_TYPES = [
  { type: 'message',  label: '행운의 응원 메세지' },
  { type: 'meme',     label: '자존감 올려주는 짤' },
  { type: 'gifticon', label: '간식 기프티콘' },
]

export default function HideTreasureType() {
  const navigate = useNavigate()
  const { state } = useLocation() // 이전 step에서 넘어온 userInfo

  function selectType(type) {
    navigate('/hide/content', {
      state: { ...state, treasureType: type },
    })
  }

  return (
    <div className="container">
      <button className="sh-back-btn" onClick={() => navigate('/')}>
        <img src= {back} alt="뒤로 가기" />
      </button>

      <h2>숨길 보물 유형 선택</h2>

      {TREASURE_TYPES.map(({ type, label }) => (
        <button
          key={type}
          className="type-btn"
          onClick={() => selectType(type)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
