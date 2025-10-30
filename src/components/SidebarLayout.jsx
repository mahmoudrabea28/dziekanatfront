
import Sidebar from './Sidebar'

export default function SidebarLayout({ children }){
  return (
    <div className="container layout">
      <Sidebar/>
      <div className="page-content">
        {children}
      </div>
    </div>
  )
}
