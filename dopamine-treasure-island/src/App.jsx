import { BrowserRouter, Routes, Route } from 'react-router-dom'

// 랜딩
import Landing from './pages/Landing'

// 보물 찾기
import TreasureMap   from './pages/Finding/TreasureMap'
import QuizMission   from './pages/Finding/QuizMission'
import PhotoMission  from './pages/Finding/PhotoMission'
import MissionResult from './pages/Finding/MissionResult'
import PhoneInput    from './pages/Finding/PhoneInput'
import LocationDetail from './pages/Finding/LocationDetail'

// 보물 숨기기
import HideStep1_Type           from './pages/Hidng/HideStep1_Type'
import HideStep2_Reward         from './pages/Hidng/HideStep2_Reward'
import HideStep3_Location       from './pages/Hidng/HideStep3_Location'
import HideStep4_MissionType    from './pages/Hidng/HideStep4_MissionType'
import HideStep5_MissionContent from './pages/Hidng/HideStep5_MissionContent'
import HideFinish               from './pages/Hidng/HideFinish'

// 관리자
import AdminAuth           from './pages/Admin/AdminAuth'
import AdminMenu           from './pages/Admin/AdminMenu'
import AdminTreasureStatus from './pages/Admin/AdminTreasureStatus'
import AdminApproval       from './pages/Admin/AdminApproval'
import AdminUserClaims     from './pages/Admin/AdminUserClaims'

export default function App() {
  return (
    <BrowserRouter basename="/dopamine-treasure-frontend/">
      <Routes>

        {/* ── 랜딩 ── */}
        <Route path="/" element={<Landing />} />

        {/* ── 보물 찾기 ── */}
        <Route path="/locations"          element={<TreasureMap />} />
        <Route path="/missions/:id/quiz"  element={<QuizMission />} />
        <Route path="/missions/:id/photo" element={<PhotoMission />} />
        <Route path="/result/:id"         element={<MissionResult />} />
        <Route path="/result"             element={<MissionResult />} />
        <Route path="/phone"              element={<PhoneInput />} />
        <Route path="/locations/:id"      element={<LocationDetail />} />

        {/* ── 보물 숨기기 ── */}
        <Route path="/hide/type"           element={<HideStep1_Type />} />
        <Route path="/hide/content"        element={<HideStep2_Reward />} />
        <Route path="/hide/location"       element={<HideStep3_Location />} />
        <Route path="/hide/mission"        element={<HideStep4_MissionType />} />
        <Route path="/hide/mission-detail" element={<HideStep5_MissionContent />} />
        <Route path="/hide/complete"       element={<HideFinish />} />

        {/* ── 관리자 ── */}
        <Route path="/admin"           element={<AdminAuth />} />
        <Route path="/admin/dashboard" element={<AdminMenu />} />
        <Route path="/admin/treasures" element={<AdminTreasureStatus />} />
        <Route path="/admin/approval"  element={<AdminApproval />} />
        <Route path="/admin/claims"    element={<AdminUserClaims />} />

      </Routes>
    </BrowserRouter>
  )
}
