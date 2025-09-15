import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/auth'
import { fileUrl } from '../utils'
export default function Navbar(){
  const { user, logout } = useAuth(); const nav = useNavigate()
  return (<header className="nav"><div className="wrap">
    <div className="row"><div className="brand"><Link to="/">Akademion</Link></div>
      <nav className="nav-links">
        <Link to="/">Main</Link>
        {user?.role==='author' && <><Link to="/my-works">My works</Link><Link to="/submit">Submit</Link><Link to="/notifications">Notifications</Link></>}
        {user?.role==='mentor' && <><Link to="/assigned">Assigned</Link><Link to="/done">Done</Link></>}
      </nav>
    </div>
    <div className="row">{!user ? <><Link to="/login">Login</Link><Link to="/register">Register</Link></> :
      <><Link to="/profile" className="row">{user?.avatarUrl && <img className="avatar" src={fileUrl(user.avatarUrl)} alt="avatar" />}{user.firstName} {user.lastName}</Link>
        <button className="btn" onClick={async()=>{await logout(); nav('/')}}>Logout</button></>}</div>
  </div></header>)
}
