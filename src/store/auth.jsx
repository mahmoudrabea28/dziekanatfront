import React,{createContext,useContext,useEffect,useState} from 'react'
import { api, setAuthToken } from '../api/axios'
const AuthCtx = createContext(null)
export function AuthProvider({children}){
  const [user,setUser]=useState(null); const [loading,setLoading]=useState(true)
  useEffect(()=>{ const t=localStorage.getItem('accessToken'); if(t){ setAuthToken(t); api.get('/users/me').then(r=>setUser(r.data)).catch(()=>setAuthToken(null)).finally(()=>setLoading(false)) } else setLoading(false) },[])
  const logout=()=>{ setAuthToken(null); setUser(null); return api.post('/auth/logout').catch(()=>{}) }
  const login=async({email,password,rememberMe})=>{ const r=await api.post('/auth/login',{email,password,rememberMe}); const {accessToken,user}=r.data; setAuthToken(accessToken); setUser(user); return user }
  const register=async(p)=>{ const r=await api.post('/auth/register',p); return r.data }
  const verifyEmail=async(p)=>{ const r=await api.post('/auth/verify-email',p); const {accessToken,user}=r.data; setAuthToken(accessToken); setUser(user); return user }
  return <AuthCtx.Provider value={{user,setUser,loading,login,logout,register,verifyEmail}}>{children}</AuthCtx.Provider>
}
export function useAuth(){ return useContext(AuthCtx) }
