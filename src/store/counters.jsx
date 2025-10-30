import React,{createContext,useContext,useState,useCallback} from 'react'
import { api } from '../api/axios'
const Ctx=createContext(null)
export function CountersProvider({children}){
  const [notifCount,setNotifCount]=useState(0)
  const [assignedCount,setAssignedCount]=useState(0)
  const refreshCounts=useCallback(async(role)=>{
    try{
      if(role==='professor'){ const r=await api.get('/notifications/unread-count'); setNotifCount(r.data.count||0) }
      if(role==='student'){ const r=await api.get('/articles/assigned/unseen-count'); setAssignedCount(r.data.count||0) }
    }catch(_){}
  },[])
  return <Ctx.Provider value={{notifCount,setNotifCount,assignedCount,setAssignedCount,refreshCounts}}>{children}</Ctx.Provider>
}
export function useCounters(){ return useContext(Ctx) }
