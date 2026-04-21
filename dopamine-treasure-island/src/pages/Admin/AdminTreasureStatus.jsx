import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdminTreasures } from '@/api'
import '@/styles/Admin.css'
import back from '@/assets/img/back.png'

const STATUS_MAP = {
  pending:  { text: '승인대기', className: 'status-pending' },
  approved: { text: '승인완료', className: 'status-approved' },
  rejected: { text: '반려',     className: 'status-rejected' },
}

const STATUS_TABS = [
  { value: 'pending',  label: '승인대기' },
  { value: 'approved', label: '승인완료' },
  { value: '',         label: '전체' },
]

export default function AdminTreasureList() {
  const navigate = useNavigate()

  const [treasures, setTreasures] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [status, setStatus] = useState('pending')

  useEffect(() => {
    loadTreasures(status, currentPage)
  }, [status, currentPage])

  async function loadTreasures(statusFilter, page) {
    setLoading(true)
    setError(false)
    try {
      const data = await getAdminTreasures(page, statusFilter)
      setTreasures(data.treasures || [])
      setTotalPages(Math.ceil((data.total || 0) / (data.size || 10)))
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  function handleStatusChange(newStatus) {
    setStatus(newStatus)
    setCurrentPage(1)
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <img src={back} alt="뒤로가기" />
        </button>
        <h1 className="admin-title">보물찾기 현황</h1>
        <div style={{ width: '50px' }} />
      </header>

      <main className="admin-content">

        {/* 상태 필터 탭 */}
        <div className="status-tabs">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              className={`tab-btn ${status === tab.value ? 'active' : ''}`}
              onClick={() => handleStatusChange(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 로딩 */}
        {loading && <p className="loading">데이터를 불러오는 중입니다...</p>}

        {/* 에러 */}
        {error && <p className="error">데이터를 불러오는데 실패했습니다.</p>}

        {/* 보물 리스트 */}
        {!loading && !error && (
          <div className="treasure-list">
            {treasures.length === 0 ? (
              <p className="empty-msg">표시할 보물이 없어요.</p>
            ) : (
              treasures.map((treasure) => {
                const { text, className } = STATUS_MAP[treasure.status] ?? { text: treasure.status, className: '' }
                return (
                  <div key={treasure.id} className="treasure-item">
                    <div className="treasure-header">
                      <span className="treasure-location">
                        {treasure.location_name || '알 수 없음'}
                      </span>
                      <span className={`treasure-status ${className}`}>
                        {text}
                      </span>
                    </div>

                    <div className="treasure-info">
                      <div className="info-item">
                        <span className="info-label">학과</span>
                        <span className="info-value">{treasure.department || '알 수 없음'}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">학번</span>
                        <span className="info-value">{treasure.student_id || '알 수 없음'}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">이름</span>
                        <span className="info-value">{treasure.name || '알 수 없음'}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">획득 개수</span>
                        <span className="info-value">{treasure.claimed_count ?? 0}</span>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* 페이지네이션 */}
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
    </div>
  )
}
