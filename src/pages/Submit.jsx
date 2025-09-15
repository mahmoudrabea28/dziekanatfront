import { useState } from 'react'
import { api } from '../api/axios'
import { useNavigate } from 'react-router-dom'
export default function Submit(){
  const nav=useNavigate()
  const [title,setTitle]=useState(''); const [scientificField,setField]=useState(''); const [keywords,setKeywords]=useState('')
  const [abstract,setAbstract]=useState(''); const [mentorEmail,setMentor]=useState(''); const [files,setFiles]=useState([]); const [err,setErr]=useState('')
  async function onSubmit(e){ e.preventDefault()
    const fd=new FormData(); fd.append('title',title); fd.append('scientificField',scientificField); fd.append('keywords',keywords); fd.append('abstract',abstract)
    if(mentorEmail) fd.append('mentorEmail',mentorEmail); for(const f of files) fd.append('files',f)
    try{ await api.post('/articles',fd,{headers:{'Content-Type':'multipart/form-data'}}); nav('/my-works') }catch(e){ setErr(e?.response?.data?.error || 'Failed to submit') } }
  return (<div className="container"><div className="card" style={{maxWidth:900,margin:'20px auto'}}>
    <h2>Add new article</h2>
    <form className="grid" onSubmit={onSubmit}>
      <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <input className="input" placeholder="Scientific field" value={scientificField} onChange={e=>setField(e.target.value)} />
      <input className="input" placeholder="keyword1, keyword2" value={keywords} onChange={e=>setKeywords(e.target.value)} />
      <textarea className="textarea" placeholder="Short description (abstract)" value={abstract} onChange={e=>setAbstract(e.target.value)} />
      <input className="input" placeholder="Mentor email (optional)" value={mentorEmail} onChange={e=>setMentor(e.target.value)} />
      <input type="file" multiple onChange={e=>setFiles(Array.from(e.target.files||[]))} />
      {err && <div className="muted" style={{color:'#dc2626'}}>{String(err)}</div>}
      <button className="btn primary">Add new article</button>
    </form></div></div>)
}
