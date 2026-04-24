import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyMission } from '@/api'; // 실제 API 경로 확인 필요

export default function PhoneSubmit() {
  const navigate = useNavigate();
  const { state } = useLocation(); 

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  // 폼 유효성 검사 및 전송
  const handleSubmit = async () => {
      console.log('userInfo:', state?.userInfo)
      console.log('location_id:', state?.userInfo?.location_id)
    // 1. 데이터 검증 
    if (!phone.trim()) return alert('전화번호를 입력해주세요!');
    if (!state?.userInfo) return alert('유저 정보가 누락되었습니다. 다시 시도해주세요.');

    setLoading(true);
    
    try {
      const { userInfo } = state;
      const formData = new FormData();

      // 명세서 기반 필드 구성 
      formData.append('name', userInfo.name);
      formData.append('student_id', userInfo.student_id);
      formData.append('department', userInfo.department);
      formData.append('phone', phone);
      formData.append('agreed', 'true'); // 명세서 상 agreed: true [cite: 46]
      formData.append('mission_type', 'photo'); 
    
      if (userInfo.image) {
        formData.append('image', userInfo.image); 
      }

      // 2. API 호출 [cite: 28]
      const result = await verifyMission(userInfo.location_id, formData);

      if (result.success) {
        localStorage.setItem('pendingMission', 'true')
        alert(result.message || '사진이 제출되었습니다! 관리자 승인을 기다려주세요.'); 
        navigate('/locations');
      } else {
        alert(result.message || '제출에 실패했습니다.'); 
      }
    } catch (error) {
      console.error('Submission Error:', error);
      alert('서버 전송 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="mission-card phone-body">
        <img src="./img/check_icon.png" className="check-icon" alt="제출완료" />
        <h2 style={{ fontSize: '22px', marginBottom: '10px' }}>인증샷 제출 완료!</h2>
        <p style={{ color: '#666', lineHeight: '1.5' }}>
          기프티콘 당첨 시 발송될<br />
          전화번호를 입력해주세요.
        </p>

        <input
          type="tel"
          className="mission-input"
          placeholder="010-0000-0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={loading}
        />

        <div className="btn-group">
          <button 
            className="submit-btn" 
            onClick={handleSubmit} 
            disabled={loading}
          >
            {loading ? '전송 중...' : '번호 전송'}
          </button>
          <button 
            className="refuse-btn secondary-btn" 
            onClick={() => setConfirmModal(true)}
            disabled={loading}
          >
            보물 안받음
          </button>
        </div>
      </main>

      {/* 보물 안받음 확인 모달 */}
      {confirmModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <p style={styles.modalText}>
              번호를 제공하지 않으면<br />
              기프티콘 수령이 어려울 수 있습니다.<br />
              <b>정말 종료할까요?</b>
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={styles.btnCancel} onClick={() => setConfirmModal(false)}>취소</button>
              <button style={styles.btnConfirm} onClick={() => navigate('/')}>종료</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// 스타일 객체 분리
const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#fff', borderRadius: '20px',
    padding: '30px 20px', textAlign: 'center',
    width: '85%', maxWidth: '320px',
  },
  modalText: {
    marginBottom: '24px', lineHeight: '1.6', fontSize: '15px'
  },
  btnCancel: {
    flex: 1, padding: '14px', borderRadius: '12px',
    border: '1px solid #ddd', background: '#fff', cursor: 'pointer'
  },
  btnConfirm: {
    flex: 1, padding: '14px', borderRadius: '12px',
    border: 'none', background: '#FF6B35', color: '#fff',
    fontWeight: 'bold', cursor: 'pointer'
  }
};