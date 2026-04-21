import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdminClaims } from '@/api'
import '@/styles/Admin.css'
import back from '@/assets/img/back.png'

const TYPE_META = {
  message:  { icon: '💬', className: 'icon-message' },
  meme:     { icon: '😂', className: 'icon-meme'    },
  gifticon: { icon: '🎁', className: 'icon-gifticon' },
}

function formatDate(dateString) {
  if (!dateString) return '알 수 없음'
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

const PAGE_SIZE = 10

export default function AdminClaims() {
  const navigate = useNavigate()

  const [claims, setClaims]           = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages]   = useState(1)

  useEffect(() => {
    loadClaims(currentPage)
  }, [currentPage])

  async function loadClaims(page) {
    setLoading(true)
    setError(false)
    try {
      const data = await getAdminClaims(page)
      setClaims(data.claims || [])
      setTotalPages(Math.ceil((data.total || 0) / PAGE_SIZE))
    } catch {
      setError(true)
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
        <div className="admin-title-container">
          <h1 className="admin-title">관리자 전용 페이지</h1>
          <p className="admin-subtitle">사용자 획득 상품 뷰어</p>
        </div>
        <div style={{ width: '50px' }} />
      </header>

      <main className="admin-content">
        {loading && <p className="loading">데이터를 불러오는 중입니다...</p>}
        {error   && <p className="error">데이터를 불러오는데 실패했습니다.</p>}

        {!loading && !error && (
          <div className="claims-list">
            {claims.length === 0 ? (
              <p className="empty-msg">획득 내역이 없어요.</p>
            ) : (
              claims.map((claim) => {
                const { icon, className } = TYPE_META[claim.treasure_type] ?? TYPE_META.message
                const isImage = claim.content?.includes('uploads/')

                return (
                  <div key={claim.id} className="claim-item">
                    <div className={`claim-icon ${className}`}>{icon}</div>

                    <div className="claim-details">
                      <div className="claim-location">
                        {claim.location_name || '알 수 없음'}
                      </div>
                      <div className="claim-user">
                        <span>{claim.claimed_by || '알 수 없음'}</span>
                        <span>•</span>
                        <span>{formatDate(claim.claimed_at)}</span>
                      </div>

                      {claim.content && (
                        <div className="claim-content">
                          {isImage ? (
                            <img
                              src={claim.content}
                              className="content-image"
                              alt="획득 상품 이미지"
                              onError={(e) => { e.target.style.display = 'none' }}
                            />
                          ) : (
                            <p className="content-text">{claim.content}</p>
                          )}
                        </div>
                      )}
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
