import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../store/auth'
export default function Login(){
  const nav=useNavigate(); const loc=useLocation(); const {login}=useAuth()
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [rememberMe,setRemember]=useState(true)
  const [err,setErr]=useState(''); const [loading,setLoading]=useState(false)
  async function onSubmit(e){ e.preventDefault(); setLoading(true); setErr(''); try{ await login({email,password,rememberMe}); nav(loc.state?.from?.pathname || '/', {replace:true}) }catch(e){ setErr(e?.response?.data?.error || 'Login failed') } finally{ setLoading(false) } }
  return (<div className="container"><div className="card" style={{maxWidth:600,margin:'40px auto'}}><h2>Login</h2>
    <form className="grid" onSubmit={onSubmit}>
      <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input type="password" className="input" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
      <label className="row"><input type="checkbox" checked={rememberMe} onChange={e=>setRemember(e.target.checked)} /> Remember me</label>
      {err && <div className="muted" style={{color:'#dc2626'}}>{String(err)}</div>}
      <button className="btn primary" disabled={loading}>{loading?'...':'Login'}</button>
    </form><div className="space"></div><div className="muted">No account? <Link to="/register">Register</Link></div></div></div>)
}
