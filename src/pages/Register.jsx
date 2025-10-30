import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../store/auth'
import { useI18n } from '../i18n/i18n'
export default function Register(){
  const { t } = useI18n() || {};
  const { register } = useAuth(); const nav=useNavigate()
  const [email,setEmail]=useState(''); const [firstName,setFirst]=useState(''); const [lastName,setLast]=useState(''); const [password,setPass]=useState(''); const [role,setRole]=useState('professor')
  const [err,setErr]=useState(''); const [loading,setLoading]=useState(false)
  async function onSubmit(e){ e.preventDefault(); setLoading(true); setErr(''); try{ await register({email,password,firstName,lastName,role}); nav('/verify',{state:{email}}) }catch(e){ setErr(e?.response?.data?.error || 'Register failed') } finally{ setLoading(false) } }
  return (<div className="container"><div className="card" style={{maxWidth:700,margin:'40px auto'}}><h2>{t('Registration')}</h2>
    <form className="grid" onSubmit={onSubmit}>
      <input className="input" placeholder={t("Email")} value={email} onChange={e=>setEmail(e.target.value)} />
      <div className="grid two"><input className="input" placeholder={t("First name")} value={firstName} onChange={e=>setFirst(e.target.value)} />
        <input className="input" placeholder={t("Last name")} value={lastName} onChange={e=>setLast(e.target.value)} /></div>
      <input type="password" className="input" placeholder={t("Password")} value={password} onChange={e=>setPass(e.target.value)} />
      <div className="row"><label><input type="radio" name="role" value="professor" checked={role==='professor'} onChange={e=>setRole(e.target.value)} />{t('Professor')}</label>
        <label style={{marginLeft:20}}><input type="radio" name="role" value="student" checked={role==='student'} onChange={e=>setRole(e.target.value)} />{t('Student')}</label></div>
      {err && <div className="muted" style={{color:'#dc2626'}}>{String(err)}</div>}
      <button className="btn primary" disabled={loading}>{loading?'...':t('Create account')}</button>
    </form><div className="space"></div><div className="muted">{t("Already have an account?")} <Link to="/login">{t("Login")}</Link></div></div></div>)
}
