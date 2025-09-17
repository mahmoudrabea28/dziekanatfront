import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../store/auth'
export default function Register(){
  const { register } = useAuth(); const nav=useNavigate()
  const [email,setEmail]=useState(''); const [firstName,setFirst]=useState(''); const [lastName,setLast]=useState(''); const [password,setPass]=useState(''); const [role,setRole]=useState('author')
  const [err,setErr]=useState(''); const [loading,setLoading]=useState(false)
  async function onSubmit(e){ e.preventDefault(); setLoading(true); setErr(''); try{ await register({email,password,firstName,lastName,role}); nav('/verify',{state:{email}}) }catch(e){ setErr(e?.response?.data?.error || 'Register failed') } finally{ setLoading(false) } }
  return (<div className="container"><div className="card" style={{maxWidth:700,margin:'40px auto'}}><h2>Registration</h2>
    <form className="grid" onSubmit={onSubmit}>
      <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <div className="grid two"><input className="input" placeholder="First name" value={firstName} onChange={e=>setFirst(e.target.value)} required />
        <input className="input" placeholder="Last name" value={lastName} onChange={e=>setLast(e.target.value)} required /></div>
      <input type="password" className="input" placeholder="Password" value={password} onChange={e=>setPass(e.target.value)} required />
      <div className="row"><label><input type="radio" name="role" value="author" checked={role==='author'} onChange={e=>setRole(e.target.value)} /> author</label>
        <label style={{marginLeft:20}}><input type="radio" name="role" value="mentor" checked={role==='mentor'} onChange={e=>setRole(e.target.value)} /> mentor</label></div>
      {err && <div className="muted" style={{color:'#dc2626'}}>{String(err)}</div>}
      <button className="btn primary" disabled={loading}>{loading?'...':'Create account'}</button>
    </form><div className="space"></div><div className="muted">Already have an account? <Link to="/login">Login</Link></div></div></div>)
}
