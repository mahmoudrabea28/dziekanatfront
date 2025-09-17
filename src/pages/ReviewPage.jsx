import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/axios'
export default function ReviewPage(){
  const { id } = useParams(); const nav=useNavigate(); const [grade,setGrade]=useState(3); const [comment,setComment]=useState(''); const [status,setStatus]=useState('under_review'); const [err,setErr]=useState('')
  const LS_KEY = React.useMemo(()=>`reviewDraft_${id}`,[id])
  React.useEffect(()=>{ try{ const s=localStorage.getItem(LS_KEY); if(s){ const v=JSON.parse(s); if(v.grade) setGrade(v.grade); if(v.comment) setComment(v.comment); if(v.status) setStatus(v.status) } }catch(_){} },[LS_KEY])
  React.useEffect(()=>{ localStorage.setItem(LS_KEY, JSON.stringify({grade,comment,status})) },[grade,comment,status])
  async function onSubmit(e){ e.preventDefault(); try{ if(comment.length>100){ setErr('Comment must be <= 100 chars'); return } await api.post('/reviews/'+id,{grade,comment,status}); localStorage.removeItem(LS_KEY); nav('/assigned') }catch(e){ setErr(e?.response?.data?.error || 'Failed to submit review') } }
  return (<div className="container"><div className="card" style={{maxWidth:800,margin:'20px auto'}}>
    <h2>Review</h2>
    <form className="grid" onSubmit={onSubmit}>
      <select className="select" value={grade} onChange={e=>setGrade(Number(e.target.value))}>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}</option>)}</select>
      <textarea className="textarea" placeholder="Comment" value={comment} maxLength={100} onChange={e=>setComment(e.target.value)} />
      <div className='muted'>{comment.length}/100</div>
      <div className="row"><label className="row">Status:&nbsp;
        <select className="select" value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="under_review">under review</option><option value="published">published</option><option value="rejected">rejected</option>
        </select></label></div>
      {err && <div className="muted" style={{color:'#dc2626'}}>{String(err)}</div>}
      <button className="btn primary">Send review</button>
    </form></div></div>)
}
