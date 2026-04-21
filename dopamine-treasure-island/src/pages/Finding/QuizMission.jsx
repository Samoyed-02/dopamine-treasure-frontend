import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { getLocation, verifyMission, claimTreasure } from '@/api'
import '@/styles/Find.css'
import back from '@/assets/img/back.png'

export default function MissionQuiz() {
  const navigate = useNavigate()
  const { id: locationId } = useParams()
  const { state } = useLocation()
  console.log('QuizMission state:', state)      // ← 여기 추가
  console.log('userInfo:', state?.userInfo) 

  const [locationName, setLocationName] = useState('장소 로딩 중...')
  const [missionText, setMissionText] = useState('데이터를 불러오고 있습니다.')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getLocation(locationId)
      .then((data) => {
        setLocationName(data.name)
        setMissionText(data.mission_content)
      })
      .catch(() => {
        setLocationName('장소 정보 없음')
        setMissionText('미션 정보를 불러오지 못했어요.')
      })
  }, [locationId])

  async function submitQuiz() {
    if (!answer.trim()) {
      alert('정답을 입력해주세요!')
      return
    }

    setLoading(true)

    const userInfo = state?.userInfo || {}

    const formData = new FormData()
    formData.append('name', userInfo.name || '익명')
    formData.append('student_id', userInfo.student_id || '00000000')
    formData.append('department', userInfo.department || '미소속')
    formData.append('mission_type', 'quiz')
    formData.append('answer', answer)

    try {
      const result = await verifyMission(locationId, formData)
        console.log('제출 answer:', answer)       // ← 추가
        console.log('verify 결과:', result)
      if (result.success) {
        const claim = await claimTreasure(locationId, userInfo.student_id || '00000000')
        console.log('claim 결과:', claim)  
        navigate('/result', {
          state: {
            status: 'success',
            type: claim.treasure?.type,
            content: claim.treasure?.content,
            img: claim.treasure?.image_path,
          },
        })
      } else {
        navigate('/result', { state: { status: 'fail' } })
      }
    } catch {
      alert('서버 연결 실패. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mission-body">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <img src={back} alt="뒤로가기" />
        </button>
        <div className="logo-container">
          <img src="./img/bennerminilogo.png" className="logo" alt="로고" />
        </div>
      </header>

      <main className="mission-content">
        <div className="mission-card">
          <h2>{locationName}</h2>

          <div className="mission-box">
            <p className="mission-label">MISSION</p>
            <p className="mission-text">{missionText}</p>
          </div>

          <input
            type="text"
            className="mission-input"
            placeholder="정답을 입력하세요"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitQuiz()}
          />

          <button
            className="submit-btn"
            onClick={submitQuiz}
            disabled={loading}
          >
            {loading ? '제출 중...' : '정답 제출'}
          </button>
        </div>
      </main>
    </div>
  )
}
