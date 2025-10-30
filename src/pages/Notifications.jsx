import { useEffect, useState } from 'react'
import { api } from '../api/axios'
import { useI18n } from '../i18n/i18n'
import { useCounters } from '../store/counters'
export default function Notifications(){
  const { t } = useI18n() || {};
  const [items,setItems]=useState([])
  const { refreshCounts } = useCounters() || {}
  async function load(){ const r=await api.get('/notifications'); setItems(r.data) }
  useEffect(()=>{ load() },[])
  async function markAll(){ await api.post('/notifications/mark-all-read'); await load(); refreshCounts && refreshCounts('professor') }
  async function markOne(id){ await api.post(`/notifications/${id}/read`); setItems(prev=>prev.map(i=>i._id===id?{...i,read:true}:i)); refreshCounts && refreshCounts('professor') }
  const unread = items.filter(i=>!i.read).length
  return (<div className="container">
    <div className="row" style={{justifyContent:'space-between'}}>
      <h2>{t('Notifications')}</h2>
      {unread >= 2 && <button className="btn" onClick={markAll}>{t('Mark all as read')}</button>}
    </div>
    {items.length===0 && <div className="muted">No notifications yet.</div>}
    {items.map(n=>(<div key={n._id} className="card">
      <div className="row" style={{justifyContent:'space-between'}}>
        <div><b>{n.type==='review'?'Review update':'Notification'}</b>{!n.read && <span className="dot unread"></span>}</div>
        <div className="muted">{new Date(n.createdAt).toLocaleString()}</div>
      </div>
      <div>
        <div>{n.message}</div>
        {(n.payload?.grade!==undefined) && <div className='muted'>Grade: <b>{n.payload.grade}</b></div>}
        {(n.payload?.status) && <div className='muted'>Status: <b>{n.payload.status}</b></div>}
        {(n.payload?.comment) && <div className='muted'>Comment: {String(n.payload.comment).slice(0,100)}</div>}
      </div>
      {!n.read && <div className="row" style={{justifyContent:'flex-end'}}><button className="btn" onClick={()=>markOne(n._id)}>{t('Mark as read')}</button></div>}
    </div>))}
  </div>)
}
