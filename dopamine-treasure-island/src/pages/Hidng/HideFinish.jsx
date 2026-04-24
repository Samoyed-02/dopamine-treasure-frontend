import { useNavigate, useLocation } from 'react-router-dom'
import '@/styles/Hide.css'

export default function HideComplete() {
  const navigate = useNavigate()
  const { state } = useLocation()  // ✅ state 받기

  return (
    <div className="container">
      <div style={{ fontSize: '50px', marginBottom: '20px' }}>✅</div>
      <h2>미션등록 완료</h2>
      <p>성공적으로 보물을 숨겼습니다!</p>

      <button className="next-btn" onClick={() => navigate('/locations')}>
        보물 찾으러 가기
      </button>

      <button
        style={{ background: '#f1f3f5' }}
        onClick={() => navigate('/hide/type', { state: { userInfo: state?.userInfo } })}  // ✅ userInfo 넘기기
      >
        보물 하나 더 숨기기
      </button>
    </div>
  )
}