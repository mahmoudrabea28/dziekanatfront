import React,{ useState } from 'react'
import { api } from '../api/axios'
import { useNavigate } from 'react-router-dom'
export default function Submit(){
  const LS_KEY='submitDraft_v1'
  const nav=useNavigate()
  const [title,setTitle]=useState(''); const [scientificField,setField]=useState(''); const [keywords,setKeywords]=useState('')
  const [abstract,setAbstract]=useState(''); const [mentorEmail,setMentor]=useState(''); const [files,setFiles]=useState([]); const [err,setErr]=useState(''); const [pdfErr,setPdfErr]=useState(''); const [emailErr,setEmailErr]=useState('')
  React.useEffect(()=>{ try{ const s=localStorage.getItem(LS_KEY); if(s){ const v=JSON.parse(s); setTitle(v.title||''); setField(v.scientificField||''); setKeywords(v.keywords||''); setAbstract(v.abstract||''); setMentor(v.mentorEmail||'') } }catch(_){} },[])
  React.useEffect(()=>{ const v={title,scientificField,keywords,abstract,mentorEmail}; localStorage.setItem(LS_KEY, JSON.stringify(v)) },[title,scientificField,keywords,abstract,mentorEmail])
  async function onSubmit(e){ e.preventDefault()
    const fd=new FormData(); fd.append('title',title); fd.append('scientificField',scientificField); fd.append('keywords',keywords); fd.append('abstract',abstract)
    if(mentorEmail) fd.append('mentorEmail',mentorEmail); for(const f of files) fd.append('files',f)
    try{ if(!mentorEmail){ setEmailErr('Mentor email is required'); return } else setEmailErr(''); if(!files.length){ setPdfErr('PDF is required'); return } else setPdfErr('')
      if(abstract.length>500){ setErr('Abstract must be <= 500 chars'); return }
      for(const f of files){ if(f.type!=='application/pdf'){ setPdfErr('Only PDF files are allowed'); return } if(f.size>10*1024*1024){ setPdfErr('PDF must be <= 10MB'); return } }
      await api.post('/articles',fd,{headers:{'Content-Type':'multipart/form-data'}}); localStorage.removeItem(LS_KEY); nav('/my-works') }catch(e){ setErr(e?.response?.data?.error || 'Failed to submit') } }
  return (<div className="container"><div className="card" style={{maxWidth:900,margin:'20px auto'}}>
    <h2>Add new article</h2>
    <form className="grid" onSubmit={onSubmit}>
      <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
      <input className="input" placeholder="Scientific field" value={scientificField} onChange={e=>setField(e.target.value)} required />
      <input className="input" placeholder="keyword1, keyword2" value={keywords} onChange={e=>setKeywords(e.target.value)} />
      <textarea className="textarea" placeholder="Short description (abstract)" value={abstract} maxLength={500} onChange={e=>setAbstract(e.target.value)} />
      <div className='muted'>{abstract.length}/500</div>
      <input className="input" placeholder="Mentor email (required)" value={mentorEmail} onChange={e=>setMentor(e.target.value)} required />{emailErr && <div className='muted' style={{color:'#dc2626'}}>{emailErr}</div>}
      <input type="file" accept='application/pdf' multiple onChange={e=>setFiles(Array.from(e.target.files||[]))} />{pdfErr && <div className='muted' style={{color:'#dc2626'}}>{pdfErr}</div>}
      {err && <div className="muted" style={{color:'#dc2626'}}>{String(err)}</div>}
      <button className="btn primary" disabled={!mentorEmail || files.length===0}>Add new article</button>
    </form></div></div>)
}
