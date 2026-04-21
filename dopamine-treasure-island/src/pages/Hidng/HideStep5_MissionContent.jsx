import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { hideTreasure } from '@/api'
import '@/styles/Hide.css'
import back from '@/assets/img/back.png'


export default function HideMissionDetail() {
  const navigate = useNavigate()
  const { state } = useLocation()
  // state 안에 쌓인 데이터:
  // userInfo { name, student_id, department }
  // treasureType, content, image
  // locationId, missionType

  const [missionContent, setMissionContent] = useState('')
  const [missionAnswer, setMissionAnswer] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleFinish() {
    if (!missionContent.trim()) {
      alert('미션 문제를 입력해주세요!')
      return
    }
    if (!missionAnswer.trim()) {
      alert('정답을 입력해주세요!')
      return
    }
    setShowModal(true)
  }

  async function confirmSubmit() {
    setShowModal(false)
    setLoading(true)

    const userInfo = state?.userInfo || {}

    const formData = new FormData()
    formData.append('name',            userInfo.name       || '익명')
    formData.append('student_id',      userInfo.student_id || '00000000')
    formData.append('department',      userInfo.department || '미소속')
    formData.append('location_id',     state?.locationId)
    formData.append('treasure_type',   state?.treasureType)
    formData.append('mission_type',    state?.missionType)
    formData.append('mission_content', missionContent)
    formData.append('mission_answer',  missionAnswer)

    if (state?.content) formData.append('content', state.content)
    if (state?.image)   formData.append('image',   state.image)

    try {
      const result = await hideTreasure(formData)
      if (result.success) {
        navigate('/hide/complete', { replace: true })
      } else {
        alert(result.message || '등록에 실패했어요. 다시 시도해주세요.')
      }
    } catch {
      alert('서버 연결 실패. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sh-container">
      <button className="sh-back-btn" onClick={() => navigate(-1)}>
        <img src={back} alt="뒤로 가기" />
      </button>

      <h2>미션 내용 작성</h2>

      <textarea
        className="sh-textarea"
        placeholder="문제를 입력하세요"
        value={missionContent}
        onChange={(e) => setMissionContent(e.target.value)}
      />

      <input
        type="text"
        className="sh-input"
        placeholder="정답 작성란 (복수 정답은 쉼표로 구분 예: 66,67,68)"
        value={missionAnswer}
        onChange={(e) => setMissionAnswer(e.target.value)}
      />

      <button
        className="sh-btn-main"
        onClick={handleFinish}
        disabled={loading}
      >
        {loading ? '등록 중...' : '숨기기 완료'}
      </button>

      {/* 확인 모달 */}
      {showModal && (
        <div className="sh-modal-overlay">
          <div className="sh-modal-content">
            <h3>이대로 등록하시겠어요?</h3>
            <p style={{ color: '#666', fontSize: '14px', margin: '15px 0' }}>
              관리자 검토 후 보물이 숨겨져요.
            </p>
            <div className="sh-modal-btns">
              <button className="sh-btn-confirm" onClick={confirmSubmit}>
                확인
              </button>
              <button className="sh-btn-cancel" onClick={() => setShowModal(false)}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
