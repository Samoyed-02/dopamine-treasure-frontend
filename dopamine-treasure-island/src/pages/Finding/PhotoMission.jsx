import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { getLocation, verifyMission } from '@/api'
import '@/styles/Find.css'
import back from '@/assets/img/back.png'
import logo from '@/assets/img/bennerminilogo.png'

export default function MissionPhoto() {
  const navigate = useNavigate()
  const { id: locationId } = useParams()
  const { state } = useLocation() // 이전 페이지에서 넘겨준 userInfo

  const [locationName, setLocationName] = useState('장소 로딩 중...')
  const [missionText, setMissionText] = useState('인증샷을 촬영하여 업로드해주세요!')
  const [preview, setPreview] = useState(null)   // 이미지 미리보기 URL
  const [fileName, setFileName] = useState('사진 선택 또는 촬영')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const fileInputRef = useRef(null)

  // 장소 정보 불러오기
  useEffect(() => {
    getLocation(locationId)
      .then((data) => {
        setLocationName(data.name)
        if (data.mission_content) setMissionText(data.mission_content)
      })
      .catch(() => setLocationName('장소 정보 없음'))
  }, [locationId])

  // 사진 선택 시 미리보기
  function handleFileChange(e) {
    const selected = e.target.files[0]
    if (!selected) return

    setFile(selected)
    setFileName(selected.name)

    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target.result)
    reader.readAsDataURL(selected)
  }

  // 사진 제출
 function submitPhoto() {
  if (!file) {
    alert('사진을 촬영하거나 업로드해주세요!')
    return
  }

  const userInfo = state?.userInfo || {}

  navigate('/phone', {
    state: {
      ...state,
      userInfo: {
        ...userInfo,
        location_id: locationId,
        image: file,
      },
    },
  })
}

  return (
    <div className="mission-body">
      <header className="header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <img src={back} alt="뒤로가기" />
        </button>
        <div className="logo-container">
          <img src={logo} className="logo" alt="로고" />
        </div>
      </header>

      <main className="mission-content">
        <div className="mission-card">
          <h2>{locationName}</h2>

          <div className="mission-box">
            <p className="mission-label">PHOTO MISSION</p>
            <p className="mission-text">{missionText}</p>
          </div>

          {/* 사진 업로드 영역 */}
          <div
            className="file-upload-area"
            onClick={() => fileInputRef.current.click()}
          >
            {preview ? (
              <img
                src={preview}
                alt="미리보기"
                style={{
                  width: '100%',
                  maxHeight: '250px',
                  objectFit: 'contain',
                  borderRadius: '10px',
                }}
              />
            ) : (
              <img src="./img/camera_icon.png" alt="카메라" style={{ width: '50px' }} />
            )}
            <p>{fileName}</p>
          </div>

          {/* 숨긴 파일 input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <button
            className="submit-btn"
            onClick={submitPhoto}
            disabled={loading}
          >
            {loading ? '업로드 중...' : '사진 제출'}
          </button>
        </div>
      </main>
    </div>
  )
}
