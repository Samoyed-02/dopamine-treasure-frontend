import { useNavigate } from 'react-router-dom'
import '@/styles/Admin.css'
import back from '@/assets/img/back.png'

const MENU_ITEMS = [
  { label: 'a. 보물찾기 현황',      path: '/admin/treasures',  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { label: 'b. 승인 대기',          path: '/admin/approval',   gradient: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)' },
  { label: 'c. 사용자 획득 상품 뷰어', path: '/admin/claims',  gradient: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)' },
]

export default function AdminDashboard() {
  const navigate = useNavigate()

  return (
    <div className="admin-menu-container">
      <header className="admin-menu-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <img src={back} alt="뒤로가기" />
        </button>
        <h1 className="admin-menu-title">관리항목 선택</h1>
        <div style={{ width: '50px' }} />
      </header>

      <main className="admin-menu-content">
        {MENU_ITEMS.map(({ label, path, gradient }) => (
          <button
            key={path}
            className="menu-button"
            style={{ background: gradient }}
            onClick={() => navigate(path)}
          >
            <span className="menu-button-text">{label}</span>
            <span className="menu-button-arrow">›</span>
          </button>
        ))}
      </main>
    </div>
  )
}
