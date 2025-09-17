import React,{createContext,useContext,useState, useCallback} from 'react'
const Ctx=createContext({add:()=>{}})
export function ToastProvider({children}){
  const [items,setItems]=useState([])
  const add=useCallback((msg)=>{ const id=Date.now()+Math.random(); setItems(x=>[...x,{id,msg}]); setTimeout(()=>setItems(x=>x.filter(i=>i.id!==id)),4000) },[])
  return (<Ctx.Provider value={{add}}>
    {children}
    <div className="toast-wrap">{items.map(t=><div key={t.id} className="toast">{t.msg}</div>)}</div>
  </Ctx.Provider>)
}
export function useToasts(){ return useContext(Ctx) }
