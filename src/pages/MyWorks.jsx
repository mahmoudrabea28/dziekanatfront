import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api/axios'
import ArticleCard from '../components/ArticleCard'
export default function MyWorks(){
  const nav=useNavigate(); const [items,setItems]=useState([])
  async function load(){ const r=await api.get('/articles/mine'); setItems(r.data) } useEffect(()=>{ load() },[])
  async function del(id){ if(!confirm('Delete this article?')) return; await api.delete('/articles/'+id); load() }
  return (<div className="container">
    <div className="row" style={{justifyContent:'flex-end'}}><Link className="btn" to="/submit">Add</Link></div>
    {items.map(a=>{ const canEdit=a.status==='submitted' || a.status==='rejected'; return (<ArticleCard key={a._id} a={a} actions={<div className="row">{canEdit && <button className="btn" onClick={()=>nav('/edit/'+a._id)}>Edit</button>}<button className="btn danger" onClick={()=>del(a._id)}>Delete</button></div>} />)})}
  </div>)
}
