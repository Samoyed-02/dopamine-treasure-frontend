import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '@/api'
import '@/styles//Admin.css'
import back from '@/assets/img/back.png'
import okayImg from '@/assets/img/okBtn.png'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function goToNext() {
    if (!password) {
      setError('비밀번호를 입력해주세요.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const result = await adminLogin(password)
      if (result.success) {
        navigate('/admin/dashboard')
      } else {
        setError('비밀번호가 틀렸어요!')
        setPassword('')
      }
    } catch {
      setError('서버 연결에 실패했어요. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <img src={back} alt="뒤로가기" />
        </button>
        <h1 className="admin-title">관리자 전용 페이지</h1>
        <div style={{ width: '50px' }} />
      </header>

      <main className="admin-content">
        <div className="password-input-container">
          <input
            type="password"
            className={`password-input ${error ? 'input-error' : ''}`}
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError('') }}
            onKeyDown={(e) => e.key === 'Enter' && goToNext()}
            autoFocus
          />
          {error && <p className="error-msg">{error}</p>}
        </div>

        <div className="admin-buttons">
          <button
            className="admin-btn admin-btn-ok"
            onClick={goToNext}
            disabled={loading}
          >
            {loading
              ? <span className="admin-loading">확인 중...</span>
              : <img src={okayImg} alt="확인" />
            }
          </button>
        </div>
      </main>
    </div>
  )
}
