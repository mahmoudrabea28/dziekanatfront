import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/axios'
export default function ReviewPage(){
  const { id } = useParams(); const nav=useNavigate(); const [grade,setGrade]=useState(3); const [comment,setComment]=useState(''); const [status,setStatus]=useState('under_review'); const [err,setErr]=useState('')
  async function onSubmit(e){ e.preventDefault(); try{ await api.post('/reviews/'+id,{grade,comment,status}); nav('/assigned') }catch(e){ setErr(e?.response?.data?.error || 'Failed to submit review') } }
  return (<div className="container"><div className="card" style={{maxWidth:800,margin:'20px auto'}}>
    <h2>Review</h2>
    <form className="grid" onSubmit={onSubmit}>
      <select className="select" value={grade} onChange={e=>setGrade(Number(e.target.value))}>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}</option>)}</select>
      <textarea className="textarea" placeholder="Comment" value={comment} onChange={e=>setComment(e.target.value)} />
      <div className="row"><label className="row">Status:&nbsp;
        <select className="select" value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="under_review">under review</option><option value="published">published</option><option value="rejected">rejected</option>
        </select></label></div>
      {err && <div className="muted" style={{color:'#dc2626'}}>{String(err)}</div>}
      <button className="btn primary">Send review</button>
    </form></div></div>)
}
