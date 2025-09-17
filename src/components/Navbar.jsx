import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/auth'
import { fileUrl } from '../utils'
import { useEffect, useRef } from 'react'
import { useCounters } from '../store/counters'
import { useToasts } from './ToastProvider'
export default function Navbar(){
  const { user, logout } = useAuth(); const nav = useNavigate()
  const { notifCount, assignedCount, refreshCounts } = useCounters() || {}
  const { add } = useToasts() || { add:()=>{} }
  const prevNotif = useRef(0); const prevAssign = useRef(0);
  useEffect(()=>{
    let t; async function tick(){ if(user?.role) await refreshCounts(user.role); t=setTimeout(tick, 20000) } tick(); return ()=>clearTimeout(t)
  }, [user])
  useEffect(()=>{ if(user?.role==='author' && notifCount>prevNotif.current){ add('New notification received'); } prevNotif.current=notifCount }, [notifCount])
  useEffect(()=>{ if(user?.role==='mentor' && assignedCount>prevAssign.current){ add('You have a new assignment'); } prevAssign.current=assignedCount }, [assignedCount])
  return (<header className="nav"><div className="wrap">
    <div className="row"><div className="brand"><Link to="/">Akademion</Link></div>
      <nav className="nav-links">
        <Link to="/">Main</Link>
        {user?.role==='author' && <><Link to="/my-works">My works</Link><Link to="/submit">Submit</Link><Link to="/notifications">Notifications{(notifCount>0)&&<span className="badge">{notifCount}</span>}</Link></>}
        {user?.role==='mentor' && <><Link to="/assigned">Assigned{(assignedCount>0)&&<span className="badge">{assignedCount}</span>}</Link><Link to="/done">Done</Link></>}
      </nav>
    </div>
    <div className="row">{!user ? <><Link to="/login">Login</Link><Link to="/register">Register</Link></> :
      <><Link to="/profile" className="row">{user?.avatarUrl ? <img className="avatar" src={fileUrl(user.avatarUrl)} alt="avatar" /> : <div className="avatar-ph">{(user?.firstName?.[0]||'U').toUpperCase()}{(user?.lastName?.[0]||'').toUpperCase()}</div>}{user.firstName} {user.lastName}</Link>
        <button className="btn" onClick={async()=>{await logout(); nav('/')}}>Logout</button></>}</div>
  </div></header>)
}
