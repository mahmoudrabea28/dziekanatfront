import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import SideMenu from './components/SideMenu'
import { AuthProvider, useAuth } from './store/auth'
import { I18nProvider } from './i18n/i18n'
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
import ReviewPage from './pages/ReviewPage'

function RequireAuth({children, role}){
  const { user, loading } = useAuth(); const loc = useLocation()
  if(loading) return <div className="container"><p>Loading...</p></div>
  if(!user) return <Navigate to="/login" state={{from:loc}} replace />
  if(role && user.role!==role) return <Navigate to="/" replace />
  return children
}

function Home(){
  const { user } = useAuth() || {}
  if(user?.role === 'professor' || user?.role === 'student') return <Navigate to="/sylabusy" replace />
  return <Main/>
}

export default function App(){
  return (<I18nProvider><AuthProvider>
    <CountersProvider>
    <ToastProvider>
    <Navbar/>
    <SideMenu/>
    <main className="page">
    <Routes>
      <Route path="/" element={<RequireAuth><Home/></RequireAuth>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/verify" element={<VerifyEmail/>}/>
      <Route path="/profile" element={<RequireAuth><Profile/></RequireAuth>}/>
      <Route path="/submit" element={<RequireAuth role="professor"><Submit/></RequireAuth>}/>
      <Route path="/sylabusy" element={<RequireAuth><MyWorks/></RequireAuth>}/>
      <Route path="/edit/:id" element={<RequireAuth role="professor"><EditArticle/></RequireAuth>}/>
      <Route path="/review/:id" element={<RequireAuth role="student"><ReviewPage/></RequireAuth>}/>
    <Route path="*" element={<Navigate to="/login" replace />}/>
    </Routes>
    </main>
    </ToastProvider>
    </CountersProvider>
  </AuthProvider></I18nProvider>)
}
