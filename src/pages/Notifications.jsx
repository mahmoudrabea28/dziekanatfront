import { useEffect, useState } from 'react'
import { api } from '../api/axios'
import { useCounters } from '../store/counters'
import { useToasts } from '../components/ToastProvider'
export default function Notifications(){
  const [items,setItems]=useState([])
  const { refreshCounts } = useCounters() || {}
  const { add } = useToasts() || { add:()=>{} }
  async function load(){ const r=await api.get('/notifications'); setItems(r.data) }
  useEffect(()=>{ load() },[])
  async function markAll(){ await api.post('/notifications/mark-all-read'); await load(); refreshCounts && refreshCounts('author') }
  async function markOne(id){ await api.post(`/notifications/${id}/read`); setItems(prev=>prev.map(i=>i._id===id?{...i,read:true}:i)); refreshCounts && refreshCounts('author') }
  return (<div className="container">
    <div className="row" style={{justifyContent:'space-between'}}>
      <h2>Notifications</h2>
      {items.some(i=>!i.read) && <button className="btn" onClick={markAll}>Mark all as read</button>}
    </div>
    {items.length===0 && <div className="muted">No notifications yet.</div>}
    {items.map(n=>(<div key={n._id} className="card">
      <div className="row" style={{justifyContent:'space-between'}}>
        <div><b>{n.type==='review'?'Review update':'Notification'}</b>{!n.read && <span className="dot unread"></span>}</div>
        <div className="muted">{new Date(n.createdAt).toLocaleString()}</div>
      </div>
      <div>{n.message}</div>
      {!n.read && <div className="row" style={{justifyContent:'flex-end'}}><button className="btn" onClick={()=>markOne(n._id)}>Mark as read</button></div>}
    </div>))}
  </div>)
}
