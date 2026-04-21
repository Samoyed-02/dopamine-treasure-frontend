import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdminTreasures, patchTreasure } from '@/api'
import '@/styles/Admin.css'
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

  const [treasures, setTreasures]     = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages]   = useState(1)
  const [detailModal, setDetailModal] = useState(null)

  const PAGE_SIZE = 10

  useEffect(() => {
    loadTreasures(currentPage)
  }, [currentPage])

  async function loadTreasures(page) {
    setLoading(true)
    setError(false)
    try {
      const data = await getAdminTreasures(page, 'pending')
      setTreasures(data.treasures || [])
      setTotalPages(Math.ceil((data.total || 0) / PAGE_SIZE))
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove(id) {
    if (!window.confirm('이 보물을 승인하시겠습니까?')) return
    try {
      const result = await patchTreasure(id, { status: 'approved' })
      if (result.success) {
        alert('승인이 완료되었습니다!')
        loadTreasures(currentPage)
      } else {
        alert('승인에 실패했습니다: ' + (result.message || '알 수 없는 오류'))
      }
    } catch {
      alert('승인 처리 중 오류가 발생했습니다.')
    }
  }

  async function handleReject(id) {
    if (!window.confirm('이 보물을 거절하시겠습니까?')) return
    try {
      const result = await patchTreasure(id, { status: 'rejected' })
      if (result.success) {
        alert('거절이 완료되었습니다!')
        loadTreasures(currentPage)
      } else {
        alert('거절에 실패했습니다: ' + (result.message || '알 수 없는 오류'))
      }
    } catch {
      alert('거절 처리 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <img src="./img/back.png" alt="뒤로가기" />
        </button>
        <h1 className="admin-title">승인 대기</h1>
        <div style={{ width: '50px' }} />
      </header>

      <main className="admin-content">
        {loading && <p className="loading">데이터를 불러오는 중입니다...</p>}
        {error   && <p className="error">데이터를 불러오는데 실패했습니다.</p>}

        {!loading && !error && (
          <div className="approval-list">
            {treasures.length === 0 ? (
              <p className="empty-msg">승인 대기 중인 보물이 없어요.</p>
            ) : (
              treasures.map((t) => {
                const { text, className } = STATUS_MAP[t.status] ?? { text: t.status, className: '' }
                const avatarChar = t.name?.[0]?.toUpperCase() ?? '?'

                return (
                  <div key={t.id} className="approval-item">
                    <div className="approval-header">
                      <div className="participant-info">
                        <div className="participant-avatar">{avatarChar}</div>
                        <div className="participant-details">
                          <span className="participant-name">{t.name || '알 수 없음'}</span>
                          <span className="participant-sub">
                            {t.department} · {t.student_id}
                          </span>
                        </div>
                      </div>
                      <span className={`status-badge ${className}`}>{text}</span>
                    </div>

                    <div className="mission-content">
                      <p className="mission-title">
                        📍 {t.location_name || `장소 ID: ${t.location_id}`}
                      </p>
                      <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                        🎁 {TYPE_MAP[t.treasure_type] || t.treasure_type}
                        {t.content && ` · ${t.content}`}
                      </p>
                      <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                        📝 미션: {t.mission_content}
                      </p>
                      <p style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>
                        ✅ 정답: {t.mission_answer}
                      </p>
                      {t.image_path && (
                        <img
                          src={`${BASE_URL}/${t.image_path}`}
                          alt="보물 이미지"
                          className="attempt-img"
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                      )}
                    </div>

                    <div className="approval-actions">
                      <button className="action-btn btn-info" onClick={() => setDetailModal(t)}>
                        상세 보기
                      </button>
                      <button className="action-btn btn-approve" onClick={() => handleApprove(t.id)}>
                        ✅ 승인
                      </button>
                      <button className="action-btn btn-reject" onClick={() => handleReject(t.id)}>
                        ❌ 거절
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`page-btn ${page === currentPage ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </main>

      {/* 상세 모달 */}
      {detailModal && (
        <div className="modal-overlay" onClick={() => setDetailModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">보물 상세 정보</h3>
            <table className="modal-table">
              <tbody>
                <tr><th>이름</th>     <td>{detailModal.name            || '-'}</td></tr>
                <tr><th>학과</th>     <td>{detailModal.department       || '-'}</td></tr>
                <tr><th>학번</th>     <td>{detailModal.student_id       || '-'}</td></tr>
                <tr><th>장소</th>     <td>{detailModal.location_name    || '-'}</td></tr>
                <tr><th>보물 유형</th><td>{TYPE_MAP[detailModal.treasure_type] || detailModal.treasure_type}</td></tr>
                <tr><th>내용</th>     <td>{detailModal.content          || '-'}</td></tr>
                <tr><th>미션</th>     <td>{detailModal.mission_content  || '-'}</td></tr>
                <tr><th>정답</th>     <td>{detailModal.mission_answer   || '-'}</td></tr>
              </tbody>
            </table>
            {detailModal.image_path && (
              <img
                src={`${BASE_URL}/${detailModal.image_path}`}
                className="modal-img"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            )}
            <button className="modal-close-btn" onClick={() => setDetailModal(null)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  )
}
