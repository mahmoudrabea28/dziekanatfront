
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../store/auth'

export default function Sidebar(){
  const { user } = useAuth() || {}
  const { pathname } = useLocation()

  const items = [
    { label: 'Profil', to: '/profile', show: !!user },
    { label: 'Sylabusy', to: '/sylabusy', show: !!user },
  ].filter(i=>i.show)

  return (
    <aside className="side-menu">
      <ul>
        {items.map(i => (
          <li key={i.to}>
            <Link to={i.to} className={pathname === i.to ? 'active' : ''}>{i.label}</Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}
