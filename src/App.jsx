import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import { AuthProvider, useAuth } from './store/auth'
import { CountersProvider } from './store/counters'
import { ToastProvider } from './components/ToastProvider'
import Main from './pages/Main'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import Profile from './pages/Profile'
import MyWorks from './pages/MyWorks'
import Submit from './pages/Submit'
import EditArticle from './pages/EditArticle'
import Assigned from './pages/Assigned'
import ReviewPage from './pages/ReviewPage'
import Notifications from './pages/Notifications'
import Done from './pages/Done'

function RequireAuth({children, role}){
  const { user, loading } = useAuth(); const loc = useLocation()
  if(loading) return <div className="container"><p>Loading...</p></div>
  if(!user) return <Navigate to="/login" state={{from:loc}} replace />
  if(role && user.role!==role) return <Navigate to="/" replace />
  return children
}
export default function App(){
  return (<AuthProvider>
    <CountersProvider>
    <ToastProvider>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Main/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/verify" element={<VerifyEmail/>}/>
      <Route path="/profile" element={<RequireAuth><Profile/></RequireAuth>}/>
      <Route path="/submit" element={<RequireAuth role="author"><Submit/></RequireAuth>}/>
      <Route path="/my-works" element={<RequireAuth role="author"><MyWorks/></RequireAuth>}/>
      <Route path="/edit/:id" element={<RequireAuth role="author"><EditArticle/></RequireAuth>}/>
      <Route path="/notifications" element={<RequireAuth role="author"><Notifications/></RequireAuth>}/>
      <Route path="/assigned" element={<RequireAuth role="mentor"><Assigned/></RequireAuth>}/>
      <Route path="/done" element={<RequireAuth role="mentor"><Done/></RequireAuth>}/>
      <Route path="/review/:id" element={<RequireAuth role="mentor"><ReviewPage/></RequireAuth>}/>
      <Route path="*" element={<Navigate to="/" replace />}/>
    </Routes>
    </ToastProvider>
    </CountersProvider>
  </AuthProvider>)
}
