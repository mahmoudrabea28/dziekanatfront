import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/auth'
import { fileUrl } from '../utils'
import { useEffect, useState } from 'react'
import { api } from '../api/axios'

export default function Navbar(){
  const { user, logout } = useAuth(); const nav = useNavigate()
  const [unread, setUnread] = useState(0)

  useEffect(()=> {
    let timer
    async function refresh(){
      if(user?.role === 'author'){
        try{
          const r = await api.get('/notifications/unread-count')
          setUnread(r.data?.count || 0)
        }catch(_){}
      } else {
        setUnread(0)
      }
      timer = setTimeout(refresh, 30000) // كل 30 ثانية
    }
    refresh()
    const fn = ()=>refresh()            // لو حابين نعمل refresh manual
    window.addEventListener('refresh-unread', fn)
    return ()=>{ clearTimeout(timer); window.removeEventListener('refresh-unread', fn) }
  }, [user?.role])

  return (
    <header className="nav">
      <div className="wrap">
        <div className="row">
          <div className="brand"><Link to="/">Akademion</Link></div>
          <nav className="nav-links">
            <Link to="/">Main</Link>
            {user?.role==='author' && <>
              <Link to="/my-works">My works</Link>
              <Link to="/submit">Submit</Link>
              <Link to="/notifications">
                Notifications {unread > 0 && <span className="badge">{unread}</span>}
              </Link>
            </>}
            {user?.role==='mentor' && <>
              <Link to="/assigned">Assigned</Link>
              <Link to="/done">Done</Link>
            </>}
          </nav>
        </div>
        <div className="row">
          {!user ? <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </> :
          <>
            <Link to="/profile" className="row">
              {user?.avatarUrl && <img className="avatar" src={fileUrl(user.avatarUrl)} alt="avatar" />}
              {user.firstName} {user.lastName}
            </Link>
            <button className="btn" onClick={async()=>{await logout(); nav('/')}}>Logout</button>
          </>}
        </div>
      </div>
    </header>
  )
}
