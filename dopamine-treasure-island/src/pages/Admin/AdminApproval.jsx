import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdminTreasures, patchTreasure, getAdminAttempts, patchAttempt } from '@/api'
import '@/styles/Admin.css'
import back from '@/assets/img/back.png'
import wood from '@/assets/img/woodbar.png'
import green from '@/assets/img/greenbar.png'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://dopamine-treasure-backend-production.up.railway.app'

const STATUS_MAP = {
  pending:  { text: '승인대기', className: 'status-pending' },
  approved: { text: '승인완료', className: 'status-approved' },
  rejected: { text: '반려',     className: 'status-rejected' },
}

const TYPE_MAP = {
  message:  '응원 메세지',
  meme:     '짤',
  gifticon: '기프티콘',
}

export default function AdminApproval() {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('treasures') // 'treasures' | 'attempts'
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [detailModal, setDetailModal] = useState(null)

  const PAGE_SIZE = 10

  // 탭이나 페이지 변경 시 데이터 로드
  useEffect(() => {
    loadData(currentPage, activeTab)
  }, [currentPage, activeTab])

  async function loadData(page, tab) {
    setLoading(true)
    setError(false)
    try {
      let data;
      if (tab === 'treasures') {
        data = await getAdminTreasures(page, 'pending') // [cite: 146]
        setItems(data.treasures || [])
      } else {
        data = await getAdminAttempts(page, 'pending') // [cite: 172]
        setItems(data.attempts || [])
      }
      setTotalPages(Math.ceil((data.total || 0) / PAGE_SIZE))
    } catch (err) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  // 승인 처리 
  async function handleApprove(id) {
    const targetName = activeTab === 'treasures' ? '보물' : '인증샷'
    if (!window.confirm(`이 ${targetName}을 승인하시겠습니까?`)) return
    
    try {
      const result = activeTab === 'treasures'
        ? await patchTreasure(id, { status: 'approved' })
        : await patchAttempt(id, { status: 'approved' })

      if (result.success) {
        alert('승인이 완료되었습니다!')
        loadData(currentPage, activeTab)
      } else {
        alert('승인 실패: ' + (result.message || '오류 발생'))
      }
    } catch {
      alert('서버 통신 오류가 발생했습니다.')
    }
  }

  // 거절 처리 
  async function handleReject(id) {
    const targetName = activeTab === 'treasures' ? '보물' : '인증샷'
    if (!window.confirm(`이 ${targetName}을 거절하시겠습니까?`)) return
    
    try {
      const result = activeTab === 'treasures'
        ? await patchTreasure(id, { status: 'rejected' })
        : await patchAttempt(id, { status: 'rejected' })

      if (result.success) {
        alert('거절 처리가 완료되었습니다.')
        loadData(currentPage, activeTab)
      }
    } catch {
      alert('처리 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-tab-group">
          <button 
            onClick={() => { setActiveTab('treasures'); setCurrentPage(1); }} 
            className={activeTab === 'treasures' ? 'active' : ''}
          >
            
            보물 승인 대기
          </button>         
          <button 
            onClick={() => { setActiveTab('attempts'); setCurrentPage(1); }} 
            className={activeTab === 'attempts' ? 'active' : ''}
          >
            인증샷 승인 대기
          </button>
        </div>
        <button className="back-button" onClick={() => navigate(-1)}>
          <img src={back} alt="뒤로가기" />
        </button>
        <h1 className="admin-title">{activeTab === 'treasures' ? '보물 관리' : '미션 관리'}</h1>
      </header>

      <main className="admin-content">
        {loading && <p className="loading">데이터 로딩 중...</p>}
        {error && <p className="error">데이터 로드 실패</p>}

        {!loading && !error && (
          <div className="approval-list">
            {items.length === 0 ? (
              <p className="empty-msg">대기 중인 항목이 없습니다.</p>
            ) : (
              items.map((item) => {
                const { text, className } = STATUS_MAP[item.status] ?? { text: item.status, className: '' }
                return (
                  <div key={item.id} className="approval-item">
                    <div className="approval-header">
                      <div className="participant-info">
                        <div className="participant-avatar">{item.name?.[0] || '?'}</div>
                        <div className="participant-details">
                          <span className="participant-name">{item.name}</span>
                          <span className="participant-sub">{item.department} · {item.student_id}</span>
                          {item.phone && (
                            <span className="participant-phone">📞 {item.phone}</span>
                          )}
                        </div>
                      </div>
                      <span className={`status-badge ${className}`}>{text}</span>
                    </div>

                    <div className="mission-content">
                      <p className="mission-title">📍 {item.location_name || `장소 ID: ${item.location_id}`}</p>
                      
                      {activeTab === 'treasures' ? (
                        <>
                          <p className="info-text">🎁 {TYPE_MAP[item.treasure_type]} {item.content && `· ${item.content}`}</p>
                          <p className="info-text">📝 미션: {item.mission_content}</p>
                          <p className="info-text success">✅ 정답: {item.mission_answer}</p>
                        </>
                      ) : (
                        <>
                        <p className="info-text">📸 미션 인증샷 제출됨</p>
                        {item.treasure_type && (
                        <p className="info-text">🎁 {TYPE_MAP[item.treasure_type]} {item.treasure_content && `· ${item.treasure_content}`}</p>
                        )}
                        {item.treasure_type && (
                          <img
                            src = {`${BASE_URL}/${item.treasure_image}`}
                            className="attempt-img" 
                            alt="보물 이미지" 
                          />
                        )}
                      </>
                      )}
                      {item.image_path && (
                        <img 
                          src={`${BASE_URL}/${item.image_path}`} 
                          className="attempt-img" 
                          alt="인증 이미지" 
                        />
                      )}
                    </div>

                    <div className="approval-actions">
                      <button className="action-btn btn-info" onClick={() => setDetailModal(item)}>상세 보기</button>
                      <button className="action-btn btn-approve" onClick={() => handleApprove(item.id)}>✅ 승인</button>
                      <button className="action-btn btn-reject" onClick={() => handleReject(item.id)}>❌ 거절</button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </main>

      {/* 상세 모달 [cite: 154-169, 178-185] */}
      {detailModal && (
        <div className="modal-overlay" onClick={() => setDetailModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">상세 정보 확인</h3>
            <table className="modal-table">
              <tbody>
                <tr><th>이름/학번</th><td>{detailModal.name} ({detailModal.student_id})</td></tr>
                <tr><th>연락처</th><td className="highlight-text">{detailModal.phone || '-'}</td></tr>
                <tr><th>학과</th><td>{detailModal.department}</td></tr>
                <tr><th>장소</th><td>{detailModal.location_name || detailModal.location_id}</td></tr>
                
                {activeTab === 'treasures' && (
                  <>
                    <tr><th>보물유형</th><td>{TYPE_MAP[detailModal.treasure_type]}</td></tr>
                    <tr><th>보물내용</th><td>{detailModal.content || '-'}</td></tr>
                    <tr><th>미션문구</th><td>{detailModal.mission_content}</td></tr>
                    <tr><th>미션정답</th><td className="success-text">{detailModal.mission_answer}</td></tr>
                  </>
                )}
                {/* ← 이거 추가 */}
                {activeTab === 'attempts' && (
                <>
                  <tr><th>보물유형</th><td>{TYPE_MAP[detailModal.treasure_type] || '-'}</td></tr>
                  <tr><th>보물내용</th><td>{detailModal.treasure_content || '-'}</td></tr>
                 </>      
                )}
              </tbody>
            </table>
            {detailModal.image_path && (
              <img src={`${BASE_URL}/${detailModal.image_path}`} className="modal-img" alt="상세 이미지" />
            )}
            <button className="modal-close-btn" onClick={() => setDetailModal(null)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  )
}