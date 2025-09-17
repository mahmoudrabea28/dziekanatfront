import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/axios'
import ArticleCard from '../components/ArticleCard'
export default function Assigned(){
  const nav=useNavigate(); const [items,setItems]=useState([])
  async function load(){ const r=await api.get('/articles/assigned',{ params: { done:false } }); setItems(r.data) }
  useEffect(()=>{ load() },[])
  return (<div className="container">
    {items.map(a=>(<div key={a._id}>
      <ArticleCard a={a} showAuthor showDownload actions={<div className="row">
        {!a.seen && <span className="dot unread" title="New assignment"></span>}
        <button className="btn" onClick={async()=>{ try{ await api.post('/articles/assigned/'+a._id+'/seen'); }catch(_){} nav('/review/'+a._id) }}>Review</button>
      </div>} />
    </div>))}
  </div>)
}
