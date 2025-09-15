import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api/axios'
export default function EditArticle(){
  const { id } = useParams(); const nav=useNavigate(); const [a,setA]=useState(null); const [files,setFiles]=useState([]); const [err,setErr]=useState('')
  useEffect(()=>{ api.get('/articles/'+id).then(r=>setA(r.data)) },[id])
  if(!a) return <div className="container"><p>Loading...</p></div>
  async function onSave(e){ e.preventDefault()
    const fd=new FormData(); fd.append('title',a.title); fd.append('scientificField',a.scientificField); fd.append('keywords',(a.keywords||[]).join(', ')); fd.append('abstract',a.abstract); if(a.mentorEmail) fd.append('mentorEmail',a.mentorEmail); for(const f of files) fd.append('files',f)
    try{ await api.patch('/articles/'+id, fd, {headers:{'Content-Type':'multipart/form-data'}}); nav('/my-works') }catch(e){ setErr(e?.response?.data?.error || 'Failed to save') } }
  const disabled = a.status!=='submitted' && a.status!=='rejected'
  return (<div className="container"><div className="card" style={{maxWidth:900,margin:'20px auto'}}>
    <h2>Edit article</h2>
    {disabled && <div className="muted" style={{color:'#dc2626'}}>Editing allowed only when status is "submitted" or "rejected".</div>}
    <form className="grid" onSubmit={onSave}>
      <input className="input" value={a.title} onChange={e=>setA({...a,title:e.target.value})} disabled={disabled} />
      <input className="input" value={a.scientificField} onChange={e=>setA({...a,scientificField:e.target.value})} disabled={disabled} />
      <input className="input" value={(a.keywords||[]).join(', ')} onChange={e=>setA({...a,keywords:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} disabled={disabled} />
      <textarea className="textarea" value={a.abstract} onChange={e=>setA({...a,abstract:e.target.value})} disabled={disabled} />
      <input className="input" placeholder="Mentor email" value={a.mentorEmail||''} onChange={e=>setA({...a,mentorEmail:e.target.value})} disabled={disabled} />
      <input type="file" multiple onChange={e=>setFiles(Array.from(e.target.files||[]))} disabled={disabled} />
      {err && <div className="muted" style={{color:'#dc2626'}}>{String(err)}</div>}
      <button className="btn primary" disabled={disabled}>Save changes</button>
    </form></div></div>)
}
