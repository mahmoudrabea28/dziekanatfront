
import { useEffect, useRef, useState } from 'react'
import { api, setAuthToken } from '../api/axios'
import { useAuth } from '../store/auth'
import { useNavigate } from 'react-router-dom'

export default function GoogleButton({ text='Continue with Google' }){
  const ref = useRef(null)
  const { setUser } = useAuth() || {}
  const nav = useNavigate()
  const [error, setError] = useState('')

  useEffect(()=>{
    function init(){
      if(!window.google || !window.google.accounts || !window.google.accounts.id) return
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
      if(!clientId){ setError('Missing VITE_GOOGLE_CLIENT_ID'); return }
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response)=>{
          try{
            const { data } = await api.post('/auth/google', { credential: response.credential })
            if(data?.accessToken && data?.user){
              localStorage.setItem('accessToken', data.accessToken)
              setAuthToken(data.accessToken)
              if(setUser) setUser(data.user)
              nav('/profile')
            }
          }catch(e){
            setError(e?.response?.data?.error || 'Google login failed')
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true
      })
      if(ref.current){
        window.google.accounts.id.renderButton(ref.current, { type: 'standard', theme: 'outline', size: 'large', text: 'continue_with', logo_alignment: 'left' })
      }
    }
    if(window.google && window.google.accounts) init()
    else{
      const iv = setInterval(()=>{
        if(window.google && window.google.accounts){ clearInterval(iv); init(); }
      }, 200)
      return ()=>clearInterval(iv)
    }
  }, [])

  return (<>
    <div ref={ref}></div>
    {error ? <div className="muted" style={{color:'#dc2626', marginTop:8}}>{String(error)}</div> : null}
  </>)
}
