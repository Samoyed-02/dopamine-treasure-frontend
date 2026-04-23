import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '@/styles/landing.css'

import topBanner   from '../assets/img/topbenner.png'
import heroImg     from '../assets/img/dpt (2).png'
import ruleIcon    from '../assets/img/rule.png'
import toFindBtn   from '../assets/img/tofind.png'
import toHideBtn   from '../assets/img/tohide.png'
import serviceInfo from '../assets/img/serviceinto.png'
import adminBtn    from '../assets/img/adminBtn.png'
import problemBtn  from '../assets/img/problem.png'
import closeBtnImg from '../assets/img/close-btn.png'
import miniLogo    from '../assets/img/bennerminilogo.png'
import okBtn       from '../assets/img/okBtn.png'
import explainRule from '../assets/img/explain_rule.png'  

export default function Landing() {
  const navigate = useNavigate()

  const [showRulesModal, setShowRulesModal] = useState(false)
  const [showInputModal, setShowInputModal] = useState(false)
  const [modalTarget, setModalTarget] = useState('find' | 'hide')
  const [showScrollTop,  setShowScrollTop]  = useState(false)
  const [form, setForm] = useState({ department: '', studentId: '', name: '' })

  // 맨위로 버튼 표시 제어
  useEffect(() => {
    function handleScroll() {
      setShowScrollTop(window.scrollY > 200)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function handleFormChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit() {
    const { department, studentId, name } = form
    if (!department || !studentId || !name) {
      alert('모든 항목을 입력해주세요!')
      return
    }
    sessionStorage.setItem('userInfo', JSON.stringify(form))
    setShowInputModal(false)
    navigate('/locations')
  }

 function goToFind() {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  if (userInfo) {
    navigate('/locations', { state: { userInfo } })
  } else {
    setModalTarget('find')
    setShowInputModal(true)
  }
}

function goToHide() {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  if (userInfo) {
    navigate('/hide/type', { state: { userInfo } })
  } else {
    setModalTarget('hide')
    setShowInputModal(true)
  }
}

function handleSubmit() {
  const { department, studentId, name } = form
  if (!department || !studentId || !name) {
    alert('모든 항목을 입력해주세요!')
    return
  }
  const userInfo = { department, student_id: studentId, name }
  localStorage.setItem('userInfo', JSON.stringify(userInfo))
  setShowInputModal(false)
  navigate(
    modalTarget === 'hide' ? '/hide/type' : '/locations',
    { state: { userInfo } }
  )
}

  return (
    <>
      {/* 헤더 */}
      <header className="header">
        <div className="banner-container">
          <img src={topBanner} alt="top banner" className="banner-image" />
        </div>
      </header>

      {/* 메인 */}
      <main className="main-content">
        <div className="hero-image">
          <img src={heroImg} alt="서비스 대표 이미지" className="main-image" />
        </div>

        <div className="button-container">
          <button className="btn btn-primary" onClick={() => setShowRulesModal(true)}>
            <img src={ruleIcon} alt="규칙설명" className="btn-image" />
          </button>
        </div>

        <div className="button-row">
          <button className="btn btn-secondary" onClick={goToFind}>
            <img src={toFindBtn} alt="찾으러가기" className="btn-image" />
          </button>
          <button className="btn btn-secondary" onClick={goToHide}>
            <img src={toHideBtn} alt="숨기러가기" className="btn-image" />
          </button>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="footer">
        <div className="content-section">
          <img src={serviceInfo} alt="서비스 소개" className="story-image" />
        </div>

        <div className="button-row">
          <button className="btn btn-admin" onClick={() => navigate('/admin')}>
            <img src={adminBtn} alt="관리자" className="btn-image" />
          </button>
          <button className="btn btn-report" onClick={() => window.open('https://open.kakao.com/o/sW4xEyqi', '_blank')} >
            <img src={problemBtn} alt="불편사항 제보하기" className="btn-image" />
          </button>
        </div>
      </footer>

      {/* 맨위로 버튼 */}
      <button
        className={`scroll-to-top ${showScrollTop ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </button>

      {/* ── 규칙 모달 ── */}
      {showRulesModal && (
        <div className="modal-overlay active" onClick={() => setShowRulesModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ minHeight: 'auto', position: 'relative'}}>
              <button className="modal-close-btn" 
                onClick={() => setShowRulesModal(false)}
                style={{ position: 'absolute', top: '10px', right: '10px'}}>
                <img src={closeBtnImg} alt="닫기" className="modal-close-image" />
              </button>
              <div className="modal-logo-container">
                <img src={miniLogo} alt="로고" className="modal-logo" />
              </div>
            </div>
            <div className="modal-content">
              <div className="modal-rules-box">
                <img src={explainRule} alt="규칙 설명" style={{ width:'100%', height: 'auto'}} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 정보입력 모달 ── */}
      {showInputModal && (
        <div className="modal-overlay active" onClick={() => setShowInputModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ minHeight: 'auto', position: 'relative'}}>
              <button 
                className="modal-close-btn" 
                onClick={() => setShowInputModal(false)}
                style={{ position: 'absolute', top: '10px', right: '10px'}}>
                <img src={closeBtnImg} alt="닫기" className="modal-close-image" />
              </button>
              <div className="modal-logo-container">
                <img src={miniLogo} alt="로고" className="modal-logo" />
              </div>
              <div className="modal-title">정보입력</div>
            </div>

            <div className="modal-content">
              <div className="input-form-container">
                <div className="input-group">
                  <label htmlFor="department">학과를 입력해주세요</label>
                  <input
                    type="text" id="department" name="department"
                    placeholder="예: 컴퓨터공학과"
                    value={form.department} onChange={handleFormChange}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="studentId">학번을 입력해주세요</label>
                  <input
                    type="text" id="studentId" name="studentId"
                    placeholder="예: 202312345"
                    value={form.studentId} onChange={handleFormChange}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="name">이름을 입력해주세요</label>
                  <input
                    type="text" id="name" name="name"
                    placeholder="예: 홍길동"
                    value={form.name} onChange={handleFormChange}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-submit" onClick={handleSubmit}>
                <img src={okBtn} alt="오케이" className="btn-image" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
