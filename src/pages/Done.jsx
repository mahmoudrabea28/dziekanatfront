import { useEffect, useState } from 'react'
import { api } from '../api/axios'
import ArticleCard from '../components/ArticleCard'
export default function Done(){
  const [items,setItems]=useState([])
  async function load(){ const r=await api.get('/articles/assigned',{ params: { done:true } }); setItems(r.data) }
  useEffect(()=>{ load() },[])
  return (<div className="container">
    {items.map(a=>(<ArticleCard key={a._id} a={a} showAuthor showDownload />))}
  </div>)
}
