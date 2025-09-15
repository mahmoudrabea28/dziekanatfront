import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/axios'
import ArticleCard from '../components/ArticleCard'
export default function Assigned(){
  const nav=useNavigate(); const [items,setItems]=useState([])
  async function load(){ const r=await api.get('/articles/assigned',{ params: { done:false } }); setItems(r.data) }
  useEffect(()=>{ load() },[])
  return (<div className="container">
    {items.map(a=>(<ArticleCard key={a._id} a={a} showAuthor showDownload actions={<button className="btn" onClick={()=>nav('/review/'+a._id)}>Review</button>} />))}
  </div>)
}
