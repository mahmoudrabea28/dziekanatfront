import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/auth'
export default function VerifyEmail(){
  const { verifyEmail } = useAuth(); const nav=useNavigate(); const loc=useLocation()
  const initialEmail=loc.state?.email||''; const [email,setEmail]=useState(initialEmail); const [code,setCode]=useState(''); const [err,setErr]=useState(''); const [loading,setLoading]=useState(false)
  async function onSubmit(e){ e.preventDefault(); setLoading(true); setErr(''); try{ await verifyEmail({email,code}); nav('/',{replace:true}) }catch(e){ setErr(e?.response?.data?.error || 'Verification failed') } finally{ setLoading(false) } }
  return (<div className="container"><div className="card" style={{maxWidth:700,margin:'40px auto'}}><h2>Confirm your email</h2>
    <p className="muted">We sent a confirmation code to <b>{email}</b>. Enter it below.</p>
    <form className="grid" onSubmit={onSubmit}>
      <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input className="input" placeholder="6-digit code" value={code} onChange={e=>setCode(e.target.value)} required />
      {err && <div className="muted" style={{color:'#dc2626'}}>{String(err)}</div>}
      <button className="btn primary" disabled={loading}>{loading?'...':'Validate'}</button>
    </form></div></div>)
}
