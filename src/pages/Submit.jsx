import React, { useState } from 'react'
import { api } from '../api/axios'
import { useI18n } from '../i18n/i18n'
import { useNavigate } from 'react-router-dom'

export default function Submit(){
  const { t } = useI18n() || {};
  const nav = useNavigate()
  const [title, setTitle] = useState('')
  const [authorsText, setAuthorsText] = useState('')
  const [pdf, setPdf] = useState(null)
  const [err, setErr] = useState('')
  const [pdfErr, setPdfErr] = useState('')

  async function onSubmit(e){
    e.preventDefault()
    setErr(''); setPdfErr('')
    if(!pdf){
      setPdfErr('PDF is required')
      return
    }
    if(pdf.type !== 'application/pdf'){
      setPdfErr('Only PDF is allowed')
      return
    }
    if(pdf.size > 10*1024*1024){
      setPdfErr('PDF must be <= 10MB')
      return
    }

    const fd = new FormData()
    fd.append('title', title)
    fd.append('authorsText', authorsText)
    fd.append('files', pdf)

    try{
      await api.post('/articles', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      nav('/sylabusy')
    }catch(e){
      setErr(e?.response?.data?.error || 'Failed to submit')
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 900, margin: '20px auto' }}>
        <h2>{t("Submit Title")}</h2>
        <form className="grid" onSubmit={onSubmit}>
          <input
            className="input"
            placeholder={t("Title")}
            value={title}
            onChange={e=>setTitle(e.target.value)}
            required
          />
          <input
            className="input"
            placeholder="Authors (e.g., Name1, Name2)"
            value={authorsText}
            onChange={e=>setAuthorsText(e.target.value)}
            required
          />
          <input
            type="file"
            accept="application/pdf"
            onChange={e=>setPdf(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
            required
          />
          {pdfErr && <div className="muted" style={{ color: '#dc2626' }}>{pdfErr}</div>}
          {err && <div className="muted" style={{ color: '#dc2626' }}>{String(err)}</div>}
          <button className="btn primary" disabled={!title || !authorsText || !pdf}>{t("Submit")}</button>
        </form>
      </div>
    </div>
  )
}
