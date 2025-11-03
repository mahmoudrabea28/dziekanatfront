import { useEffect, useState } from 'react'
import { api } from '../api/axios'
import { useAuth } from '../store/auth'
import { fileUrl } from '../utils'
import { useI18n } from '../i18n/i18n'
export default function Profile(){
  const { t } = useI18n() || {};
  const { user, setUser } = useAuth()
  const [firstName, setFirst] = useState(user?.firstName||'')
  const [lastName, setLast] = useState(user?.lastName||'')
  const [phone, setPhone] = useState(user?.phone||'')
  const [password, setPass] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [msg, setMsg] = useState('')
  useEffect(()=>{ setFirst(user?.firstName||''); setLast(user?.lastName||''); setPhone(user?.phone||'') }, [user])
  async function onSave(e){
    e.preventDefault()
    const fd = new FormData()
    fd.append('firstName', firstName); fd.append('lastName', lastName); fd.append('phone', phone)
    if(password) fd.append('password', password); if(avatar) fd.append('avatar', avatar)
    const r = await api.patch('/users/me', fd, { headers: {'Content-Type':'multipart/form-data'} })
    setUser(r.data); setMsg(t('Saved!')); setTimeout(()=>setMsg(''), 2000)
  }
  const preview = avatar ? URL.createObjectURL(avatar) : (user?.avatarUrl ? fileUrl(user.avatarUrl) : null)
  const initials = (user?.firstName?.[0]||'').toUpperCase() + (user?.lastName?.[0]||'').toUpperCase()
  return (<div className="container"><div className="card" style={{maxWidth:800,margin:'20px auto'}}>
    <h2>{t('My Profile')}</h2>
    <form className="grid" onSubmit={onSave}>
      <div className="row" style={{alignItems:'center',gap:16}}>
        <button type="button" className="avatar-btn" onClick={()=>document.getElementById('avatarInput').click()}>
          {preview ? <img className="avatar" src={preview} alt="avatar"/> : <div className="avatar-ph">{initials || 'U'}</div>}
        </button>
        <input id="avatarInput" style={{display:'none'}} type="file" accept="image/*" onChange={e=>setAvatar(e.target.files?.[0]||null)} />
        <div className="muted">Role: <b>{user?.role==='professor'?'Professor':'Student'}</b></div>
      </div>
      <div className="grid two"><input className="input" placeholder={t("First name")} value={firstName} onChange={e=>setFirst(e.target.value)} />
        <input className="input" placeholder={t("Last name")} value={lastName} onChange={e=>setLast(e.target.value)} /></div>
      <div className="grid two"><input className="input" placeholder={t("Phone")} value={phone} onChange={e=>setPhone(e.target.value)} />
        <input className="input" placeholder={t("New password")} value={password} onChange={e=>setPass(e.target.value)} /></div>
      <button className="btn primary">{t('Save')}</button>{msg && <div className="muted">{msg}</div>}
    </form></div></div>)
}
