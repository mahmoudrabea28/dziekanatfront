import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/auth'
import { useI18n, LanguageSwitcher } from '../i18n/i18n'
import { fileUrl } from '../utils'

export default function Navbar(){
  const { t } = useI18n() || {};
  const { user, logout } = useAuth() || {}
  const nav = useNavigate()
  return (
    <header className="nav">
      <div className="wrap">
        <div className="row">
          {user && (
  <button
    className="menu-btn"
    aria-label="Menu"
    onClick={() => window.dispatchEvent(new CustomEvent("toggle-sidemenu"))}
  >
    <span></span><span></span><span></span>
  </button>
)}
<div className="brand"><Link to="/">Dziekanat</Link></div>
          
        </div>
        <div className="row">
          <LanguageSwitcher />
          {!user ? (<>
            <Link to="/login">{t('Login')}</Link>
            <Link to="/register">{t('Register')}</Link>
          </>) : (<>
            
            <div className="row user-summary" aria-label="User">
  {user?.avatarUrl
    ? <img src={fileUrl(user.avatarUrl)} alt="avatar" className="avatar"/>
    : <div className="avatar">{(user?.firstName||'')?.charAt(0)?.toUpperCase()}</div>}
  {user?.firstName} {user?.lastName}
</div>
            <button className="btn" onClick={async()=>{ await logout(); nav('/'); }}>{t('Logout')}</button>
          </>)}
        </div>
      </div>
    </header>
  )
}
