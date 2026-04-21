import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '@/styles/Find.css'
import back from '@/assets/img/back.png'

export default function Result() {
    const navigate = useNavigate()

    const { state } = useLocation()
    const status = state?.status
    const type = state?.type
    const content = state?.content
    const imgPath = state?.img

  // 'fail' | 'box' | 'reward'
  const [view, setView] = useState(null)

  useEffect(() => {
    setView(status === 'success' ? 'box' : 'fail')
  }, [status])

  function openTreasure() {
    setView('reward')
  }

  const rewardTitle = {
    note: '행운의 쪽지',
    gifticon: '기프티콘 당첨!',
    meme: '재미있는 짤',
  }[type] ?? '보물 획득!'

  const hasImage = (type === 'gifticon' || type === 'meme') && imgPath

  return (
    <>
      <header className="header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <img src={back} alt="뒤로가기" />
        </button>
        <div className="logo-container">
          <img src="./img/bennerminilogo.png" className="logo" alt="로고" />
        </div>
      </header>

      <main className="result-card">

        {/* 실패 화면 */}
        {view === 'fail' && (
          <div>
            <h2 style={{ color: '#ff4d4d', fontSize: '28px' }}>아쉬워요!</h2>
            <img src="./img/fail_icon.png" style={{ width: '150px', margin: '30px 0' }} alt="실패" />
            <p>정답이 아니네요.<br />다시 한번 확인해보세요!</p>
            <button className="mission-btn" onClick={() => navigate(-1)}>
              다시 도전하기
            </button>
          </div>
        )}

        {/* 보물상자 화면 */}
        {view === 'box' && (
          <div>
            <h2 className="success-title">정답입니다!</h2>
            <p style={{ marginBottom: '30px' }}>보물이 든 상자가 나타났어요!</p>
            <img
              src="./img/treasure_box.png"
              className="treasure-box"
              alt="보물상자"
              onClick={openTreasure}
            />
            <p style={{ marginTop: '20px', color: '#666', fontSize: '14px' }}>
              상자를 터치해서 보물을 확인하세요.
            </p>
          </div>
        )}

        {/* 보물 공개 화면 */}
        {view === 'reward' && (
          <div>
            <h2 className="success-title">{rewardTitle}</h2>
            <div>
              {hasImage && (
                <img src={imgPath} className="reward-img" alt="보물 이미지" />
              )}
              <p className="reward-text">{content}</p>
            </div>
            <p style={{ fontSize: '13px', color: '#888', marginTop: '20px' }}>
              ✅ 30분 동안 다른 미션 참여가 제한됩니다.
            </p>
            <button
              className="mission-btn"
              style={{ marginTop: '20px' }}
              onClick={() => navigate('/locations')}
            >
              지도로 돌아가기
            </button>
          </div>
        )}

      </main>
    </>
  )
}
