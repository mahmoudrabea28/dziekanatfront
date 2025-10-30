import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api/axios'
import { useI18n } from '../i18n/i18n'
import { fileUrl } from '../utils'

export default function EditArticle(){
  const { t } = useI18n() || {};
  const { id } = useParams()
  const nav = useNavigate()
  const [a, setA] = useState(null)
  const [pdf, setPdf] = useState(null)
  const [err, setErr] = useState('')

  useEffect(()=>{
    api.get('/articles/'+id).then(r=>setA(r.data))
  },[id])

  if(!a) return <div className="container"><p>Loading...</p></div>

  const disabled = a.status!=='submitted' && a.status!=='rejected'
  const firstPdf = (a.files||[]).find(f=>(f.mime||'').toLowerCase().includes('pdf'))
  const currentPdfUrl = firstPdf ? fileUrl(firstPdf.url) : (a.publishedPdfUrl ? fileUrl(a.publishedPdfUrl) : null)
  const currentPdfName = firstPdf?.name || (a.publishedPdfUrl ? 'article.pdf' : null)

  async function onSave(e){
    e.preventDefault()
    setErr('')
    const fd = new FormData()
    fd.append('title', a.title||'')
    fd.append('authorsText', a.authorsText||'')
    if(pdf){ fd.append('files', pdf) }
    try{
      await api.patch('/articles/'+id, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      nav('/sylabusy')
    }catch(e){
      setErr(e?.response?.data?.error || 'Failed to save')
    }
  }

  return (
    <div className="container">
      <div className="card" style={{maxWidth:900,margin:'20px auto'}}>
        <h2>{t("Edit title")}</h2>
        {disabled && <div className="muted" style={{color:'#dc2626'}}>Editing allowed only when status is "submitted" or "rejected".</div>}

        <form className="grid" onSubmit={onSave}>
          <input
            className="input"
            placeholder={t("Title")}
            value={a.title||''}
            onChange={e=>setA({...a, title:e.target.value})}
            disabled={disabled}
            required
          />

          <input
            className="input"
            placeholder="Authors (e.g., Name1, Name2)"
            value={a.authorsText||''}
            onChange={e=>setA({...a, authorsText:e.target.value})}
            disabled={disabled}
            required
          />

          {/* Current PDF */}
          {currentPdfUrl && (
            <div className="row" style={{gap:8, alignItems:'center'}}>
              <span className="muted">Current {t('PDF:')}</span>
              <a className="btn" href={currentPdfUrl} target="_blank" rel="noopener noreferrer" download={currentPdfName || true}>
                {currentPdfName || 'Download PDF'}
              </a>
            </div>
          )}

          {/* Replace PDF */}
          <input
            type="file"
            accept="application/pdf"
            onChange={e=>setPdf(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
            disabled={disabled}
          />
          <div className="muted">choose a PDF to replace the existing one (max 10MB).</div>

          {err && <div className="muted" style={{ color:'#dc2626' }}>{String(err)}</div>}
          <button className="btn primary" disabled={disabled}>{t("Save changes")}</button>
        </form>
      </div>
    </div>
  )
}
