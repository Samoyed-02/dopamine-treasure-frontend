import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { getLocation, verifyMission, claimTreasure } from '@/api'
import '@/styles/Find.css'
import back from '@/assets/img/back.png'
import logo from '@/assets/img/bennerminilogo.png'

export default function MissionQuiz() {
  const navigate = useNavigate()
  const { id: locationId } = useParams()
  const { state } = useLocation()

  const userInfo = state?.userInfo || {};
  console.log('QuizMission state:', state)      // ← 여기 추가
  console.log('userInfo:', state?.userInfo) 
  console.log('보내기 직전 userInfo:', userInfo)

  const [locationName, setLocationName] = useState('장소 로딩 중...')
  const [missionText, setMissionText] = useState('데이터를 불러오고 있습니다.')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const userInfo = state?.useInfo || JSON.parse(localStorage.getItem('userInfo'))|| {}
    getLocation(locationId, userInfo?.student_id)
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
  if (!answer.trim()) return alert('정답을 입력해주세요!');
  setLoading(true);
  console.log(userInfo);
  

  const formData = new FormData();
  formData.append('name', userInfo.name || '익명');
  formData.append('student_id', userInfo.student_id || '00000000');
  formData.append('department', userInfo.department || '미소속');
  formData.append('mission_type', 'quiz');
  formData.append('answer', answer.trim()); // 공백 제거 필수 [cite: 37]

  try {
    const result = await verifyMission(locationId, formData);
    
    if (result.success) {
      // 보물 획득 시 학번 정보를 객체로 전달 [cite: 65]
     const claim = await claimTreasure(locationId, userInfo.student_id);
     console.log('claim 전체 결과:', claim)  // ← 추가
     console.log('claim.treasure:', claim.treasure)  // ← 추가
      // 결과 페이지로 이동 시 ID를 경로에 포함
      navigate(`/result/${locationId}`, {
        state: {
          status: 'success',
          locationId: locationId,
          type: claim.treasure?.type,
          content: claim.treasure?.content,
          img: claim.treasure?.image_path,
          userInfo: userInfo // 다음 페이지(Result)에서 쓸 데이터들
        },
      });
    } else {
      // 실패 시에도 userInfo를 넘겨줘야 '다시 시도'가 원활합니다.
      navigate(`/result/${locationId}`, { 
        state: { status: 'fail', userInfo: userInfo } 
      });
    }
  } catch (e) {
    alert('서버 연결 실패. 다시 시도해주세요.');
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="mission-body">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <img src={back} alt="뒤로가기" />
        </button>
        <div className="logo-container">
          <img src={logo} className="logo" alt="로고" />
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
