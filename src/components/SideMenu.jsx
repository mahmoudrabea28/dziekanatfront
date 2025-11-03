
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../store/auth'
import { useI18n } from '../i18n/i18n'

export default function SideMenu(){
  const [open,setOpen]=useState(false)
  const { user } = useAuth() || {}
  const loc = useLocation()
  const { t } = useI18n() || {};

  useEffect(()=>{
    const h = ()=> setOpen(o=>!o)
    window.addEventListener('toggle-sidemenu', h)
    return ()=> window.removeEventListener('toggle-sidemenu', h)
  },[])

  // Close on route change
  useEffect(()=>{ setOpen(false) }, [loc.pathname])
  useEffect(()=>{
    document.body.classList.toggle('sidemenu-open', open)
    return ()=> document.body.classList.remove('sidemenu-open')
  },[open])


  if(!user) return null

  const isActive = (path)=> loc.pathname.startsWith(path)

  return (
    <aside className={'sidemenu'+(open?' open':'')}>
      <nav>
        <Link to="/profile" className={isActive('/profile')?'active':''}>{t("Profile")}</Link>
        <Link to="/sylabusy" className={isActive('/sylabusy')?'active':''}>Sylabusy</Link>
      </nav>
    </aside>
  )
}
