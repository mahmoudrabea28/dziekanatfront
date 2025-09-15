import { useEffect, useState } from 'react'
import { api } from '../api/axios'
export default function Notifications(){
  const [items,setItems]=useState([])
  useEffect(()=>{ api.get('/notifications').then(r=>setItems(r.data)) },[])
  return (<div className="container"><h2>Notifications</h2>{items.length===0 && <div className="muted">No notifications yet.</div>}
    {items.map(n=>(<div key={n._id} className="card"><div className="muted">{new Date(n.createdAt).toLocaleString()}</div><div>{n.message}</div>{n.payload && <pre className="muted" style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(n.payload,null,2)}</pre>}</div>))}
  </div>)
}
