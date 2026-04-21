import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '@/styles/Hide.css'
import back from '@/assets/img/back.png'

const TYPE_META = {
  message:  { title: '응원 메세지 등록', emoji: '💌' },
  meme:     { title: '짤 등록',          emoji: '😂' },
  gifticon: { title: '기프티콘 등록',    emoji: '🎁' },
}

export default function HideTreasureContent() {
  const navigate = useNavigate()
  const { state } = useLocation() // { userInfo, treasureType, ... }

  const treasureType = state?.treasureType ?? 'message'
  const { title, emoji } = TYPE_META[treasureType]

  const [content, setContent] = useState('')   // message / gifticon 설명
  const [file, setFile] = useState(null)        // meme / gifticon 이미지
  const [preview, setPreview] = useState(null)
  const [fileName, setFileName] = useState('이미지를 선택하세요')

  const fileInputRef = useRef(null)

  function handleFileChange(e) {
    const selected = e.target.files[0]
    if (!selected) return
    setFile(selected)
    setFileName(selected.name)
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target.result)
    reader.readAsDataURL(selected)
  }

  function handleNext() {
    // 유효성 검사
    if (treasureType === 'message' && !content.trim()) {
      alert('응원 메세지를 입력해주세요!')
      return
    }
    if (treasureType === 'meme' && !file) {
      alert('짤 이미지를 업로드해주세요!')
      return
    }
    if (treasureType === 'gifticon' && (!file || !content.trim())) {
      alert('기프티콘 이미지와 설명을 모두 입력해주세요!')
      return
    }

    // 다음 단계(미션 설정)로 state 누적 전달
    navigate('/hide/location', {
      state: {
        ...state,
        content: content || null,
        image: file || null,
      },
    })
  }

  return (
    <div className="container">
      <button className="sh-back-btn" onClick={() => navigate(-1)}>
        <img src={back} alt="뒤로 가기" />
      </button>

      <h2>{emoji} {title}</h2>

      {/* ── 응원 메세지 ── */}
      {treasureType === 'message' && (
        <div className="input-area">
          <label className="input-label">응원 메세지</label>
          <textarea
            className="mission-input"
            placeholder="수원대 학우들에게 따뜻한 한마디를 남겨주세요 💛"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={200}
          />
          <p className="char-count">{content.length} / 200</p>
        </div>
      )}

      {/* ── 짤 ── */}
      {treasureType === 'meme' && (
        <div className="input-area">
          <label className="input-label">짤 이미지</label>
          <div
            className="file-upload-area"
            onClick={() => fileInputRef.current.click()}
          >
            {preview
              ? <img src={preview} alt="미리보기" className="preview-img" />
              : <p>📂 {fileName}</p>
            }
          </div>
        </div>
      )}

      {/* ── 기프티콘 ── */}
      {treasureType === 'gifticon' && (
        <div className="input-area">
          <label className="input-label">기프티콘 이미지</label>
          <div
            className="file-upload-area"
            onClick={() => fileInputRef.current.click()}
          >
            {preview
              ? <img src={preview} alt="미리보기" className="preview-img" />
              : <p>📂 {fileName}</p>
            }
          </div>

          <label className="input-label" style={{ marginTop: '14px' }}>기프티콘 설명</label>
          <input
            type="text"
            className="mission-input"
            placeholder="예) 스타벅스 아메리카노"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      )}

      {/* 공통 파일 input (meme / gifticon) */}
      {treasureType !== 'message' && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      )}

      <button className="next-btn" onClick={handleNext}>
        장소 선택하러 가기
      </button>
    </div>
  )
}
