import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function PhoneSubmit() {
  const navigate = useNavigate()
  const { state } = useLocation() // 이전 페이지에서 넘겨준 userInfo

  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirm, setConfirm] = useState(false) // 보물 안받음 확인 모달

  async function submitPhone() {
    if (!phone.trim()) {
      alert('번호를 입력해주세요!')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('phone', phone)
      formData.append('agreed', true)

      // state로 받은 userInfo 추가
      if (state?.userInfo) {
        const { name, student_id, department, location_id, image } = state.userInfo
        formData.append('name', name)
        formData.append('student_id', student_id)
        formData.append('department', department)
        formData.append('location_id', location_id)
        formData.append('mission_type', 'photo')
        if (image) formData.append('image', image)
      }

      // TODO: 실제 API 호출로 교체
      // await verifyMission(state?.userInfo?.location_id, formData)

      alert('입력이 완료되었습니다! 관리자 승인 후 보물이 지급됩니다.')
      navigate('/locations')
    } catch (e) {
      alert('전송 실패. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  function handleNoPhone() {
    setConfirm(true)
  }

  function confirmNoPhone() {
    setConfirm(false)
    navigate('/locations')
  }

  return (
    <>
      <main className="mission-card phone-body">
        <img src="./img/check_icon.png" className="check-icon" alt="제출완료" />
        <h2>인증샷 제출 완료!</h2>
        <p>
          기프티콘 당첨 시 발송될<br />
          전화번호를 입력해주세요.
        </p>

        <input
          type="tel"
          className="mission-input"
          placeholder="010-0000-0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <div className="btn-group">
          <button
            className="submit-btn"
            onClick={submitPhone}
            disabled={loading}
          >
            {loading ? '전송 중...' : '번호 전송'}
          </button>
          <button
            className="refuse-btn secondary-btn"
            onClick={handleNoPhone}
            disabled={loading}
          >
            보물 안받음
          </button>
        </div>
      </main>

      {/* 보물 안받음 확인 모달 */}
      {confirm && (
        <div style={overlay}>
          <div style={modal}>
            <p style={{ marginBottom: '16px', lineHeight: '1.6' }}>
              번호를 제공하지 않으면<br />기프티콘 수령이 어려울 수 있습니다.<br />종료할까요?
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                style={modalBtnCancel}
                onClick={() => setConfirm(false)}
              >
                취소
              </button>
              <button
                style={modalBtnConfirm}
                onClick={confirmNoPhone}
              >
                종료
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// 모달 인라인 스타일 (별도 CSS 없이 간단하게)
const overlay = {
  position: 'fixed', inset: 0,
  background: 'rgba(0,0,0,0.45)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 999,
}
const modal = {
  background: '#fff',
  borderRadius: '16px',
  padding: '28px 24px',
  textAlign: 'center',
  width: '280px',
  fontSize: '15px',
}
const modalBtnCancel = {
  flex: 1, padding: '12px',
  borderRadius: '10px',
  border: '1.5px solid #ddd',
  background: '#fff',
  cursor: 'pointer', fontSize: '15px',
}
const modalBtnConfirm = {
  flex: 1, padding: '12px',
  borderRadius: '10px',
  border: 'none',
  background: '#FF6B35',
  color: '#fff',
  cursor: 'pointer', fontSize: '15px', fontWeight: '700',
}
