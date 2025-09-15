import { useEffect, useState } from 'react'
import { api, API_URL } from '../api/axios'
import ArticleCard from '../components/ArticleCard'
export default function Main(){
  const [items,setItems]=useState([]); const [q,setQ]=useState('')
  async function fetchList(){ const r=await api.get('/articles',{params:{ q:q||undefined, status:'published' }}); setItems(r.data) }
  useEffect(()=>{ fetchList() },[])
  return (<div className="container">
    <div className="card"><div className="row">
      <input className="input" placeholder="Search by title, keywords..." value={q} onChange={e=>setQ(e.target.value)} />
      <button className="btn" onClick={fetchList}>Search</button>
      <a className="btn" href={`${API_URL}/export/articles.pdf`} target="_blank">Export PDF</a>
      <a className="btn" href={`${API_URL}/export/articles.csv`} target="_blank">Export CSV</a>
    </div></div>
    {items.map(a=><ArticleCard key={a._id} a={a} showAuthor showMentor showDownload />)}
  </div>)
}
