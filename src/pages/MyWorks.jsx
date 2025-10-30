import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useI18n } from '../i18n/i18n'
import { api } from '../api/axios'
import { useAuth } from '../store/auth'
import ArticleCard from '../components/ArticleCard'

export default function MyWorks(){
  const { t } = useI18n() || {};
  const nav = useNavigate()
  const { user } = useAuth() || {}
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')

  // --- جديد: إظهار/إخفاء البحث
  const [showSearch, setShowSearch] = useState(false)
  const inputRef = useRef(null)
  useEffect(()=>{ if(showSearch) inputRef.current?.focus() }, [showSearch])

  async function load(){
    const url = (user?.role === 'student') ? '/articles' : '/articles/mine'
    const r = await api.get(url)
    setItems(r.data || [])
  }
  useEffect(()=>{ load() }, [user?.role])

  async function del(id){
    if(user?.role !== 'professor') return
    if(!confirm('Delete this article?')) return
    await api.delete('/articles/'+id)
    load()
  }

  const filtered = items.filter(a=>{
    const qq = (q||'').trim().toLowerCase()
    if(!qq) return true
    const title = (a.title||'').toLowerCase()
    const authors = (a.authorsText||'').toLowerCase()
    return title.includes(qq) || authors.includes(qq)
  })

  return (
    <div className="container">
      <div className="row" style={{justifyContent:'space-between', alignItems:'center'}}>
        <div className="row" style={{gap:8, flex:1, minWidth:0}}>
          {/* زر أيقونة البحث */}
          <button
            className="btn"
            type="button"
            aria-label={showSearch ? 'Hide search' : 'Show search'}
            onClick={()=>setShowSearch(v=>!v)}
            title="Search"
          >
            {/* SVG بحث */}
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          {/* input البحث يظهر فقط عند الضغط */}
          <input
            ref={inputRef}
            className={`input search-collapsible ${showSearch ? 'open' : ''}`}
            placeholder={t("Search by title or authors")}
            value={q}
            onChange={e=>setQ(e.target.value)}
            onKeyDown={e=>{ if(e.key==='Escape') setShowSearch(false) }}
            aria-hidden={!showSearch}
          />
        </div>

        {/* زر + كأيقونة (للكاتب فقط) */}
        {user?.role==='professor' && (
          <Link className="btn" to="/submit" aria-label="Create new title" title={t("Create new Title")}>
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="hide-sm">{t("Create new Title")}</span>
          </Link>
        )}
      </div>

      {filtered.map(a=>{
        const canEdit = user?.role==='professor' && (a.status==='submitted' || a.status==='rejected')
        const actions = (user?.role==='professor')
          ? (<div className="row" style={{gap:8}}>
              {canEdit && <button className="btn" onClick={()=>nav('/edit/'+a._id)}>{t("Edit")}</button>}
              <button className="btn danger" onClick={()=>del(a._id)}>{t("Delete")}</button>
            </div>)
          : null
        return <ArticleCard key={a._id} a={a} actions={actions} />
      })}
    </div>
  )
}
