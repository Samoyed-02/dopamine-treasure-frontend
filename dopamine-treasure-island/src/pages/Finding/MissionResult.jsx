import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '@/styles/Find.css'
import back from '@/assets/img/back.png'
import logo from '@/assets/img/bennerminilogo.png'
import goldbar from '@/assets/img/goldbar.png'
import backFlower from '@/assets/img/back_flower.png'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://dopamine-treasure-backend-production.up.railway.app'

const REWARD_TITLES = {
  message:  '행운의 메시지 💌',
  meme:     '재미있는 짤 🤣',
  gifticon: '기프티콘 당첨! 🎁',
}

export default function Result() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const [view, setView]     = useState(null)
  const [reward, setReward] = useState(null)

  useEffect(() => {
    setView(state?.status === 'success' ? 'box' : 'fail')
  }, [state])

  useEffect(() => {
  if (state?.status === 'success') {
    const limitUntil = new Date(Date.now() + 30 * 60 * 1000).toISOString()
    localStorage.setItem('missionLimitUntil', limitUntil)  // ✅ 30분 후 시각 저장
  }
}, [state])

  function openTreasure() {
    setReward({
      type:       state?.type,
      content:    state?.content,
      image_path: state?.img,
    })
    setView('reward')
  }

  return (
    <>
      <header className="header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <img src={back} alt="뒤로가기" />
        </button>
        <div className="logo-container">
          <img src={logo} className="logo" alt="로고" />
        </div>
      </header>

      <main className="result-card">

        {/* ── 실패 화면 ── */}
        {view === 'fail' && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#ff4d4d', fontSize: '28px' }}>아쉬워요!</h2>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img src={goldbar} alt="실패" />
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1, fontWeight: 'bold', fontSize: '20px',
                color: 'white', textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
              }}>실패</div>
            </div>
            <p>정답이 아니네요.<br />다시 한번 확인해보세요!</p>
            <button className="mission-btn" onClick={() => navigate(-1)}>
              다시 도전하기
            </button>
          </div>
        )}

        {/* ── 보물상자 화면 ── */}
        {view === 'box' && (
          <div style={{ textAlign: 'center' }}>
            <h2 className="success-title">미션 성공!!</h2>
            <p style={{ marginBottom: '30px' }}>보물이 든 상자가 나타났어요!</p>
            <div className="treasure-container" onClick={openTreasure}>
              <img src={goldbar} className="treasure-box" alt="보물상자" />
              <div className="treasure-text">보물 상자</div>
            </div>
            <p style={{ marginTop: '20px', color: '#666', fontSize: '14px' }}>
              상자를 눌러 보물을 확인하세요!
            </p>
          </div>
        )}


        {/* ── 보물 공개 화면 ── */}
        {view === 'reward' && reward && (
          <div className="reward-display">
            <h2 className="success-title">
              {REWARD_TITLES[reward.type] || '보물 획득!'}
            </h2>

            <div className="reward-content-box">
              {/* 응원 메세지 → 꽃 배경 위에 문구 겹치기 */}
              {reward.type === 'message' ? (
                <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                  <img src={backFlower} alt="배경" style={{ width: '100%' }} />
                  <p style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '75%', textAlign: 'center',
                    fontSize: '16px', fontWeight: 'bold',
                    color: '#333', wordBreak: 'keep-all',
                    lineHeight: '1.6',
                  }}>
                    {reward.content}
                  </p>
                </div>
              ) : (
                <>
                  {reward.image_path && (
                    <img
                      src={`${BASE_URL}/${reward.image_path}`}
                      className="reward-img"
                      alt="보물 이미지"
                    />
                  )}
                  {reward.content && (
                    <p className="reward-text">{reward.content}</p>
                  )}
                </>
              )}
            </div>

            <p style={{ fontSize: '13px', color: '#888', marginTop: '20px' }}>
              ✅ 30분 동안 다른 미션 참여가 제한됩니다.
            </p>
            <button
              className="mission-btn"
              style={{ marginTop: '20px' }}
              onClick={() => navigate('/')}
            >
              홈으로 가지
            </button>
          </div>
        )}

      </main>
    </>
  )
}
