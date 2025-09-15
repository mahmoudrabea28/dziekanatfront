import { API_URL } from './api/axios'
export const prettyStatus = (s)=>({submitted:'submitted',under_review:'under review',rejected:'rejected',published:'published'}[s]||s)
export const fileUrl = (p)=> p?.startsWith('http') ? p : (API_URL.replace(/\/$/,'') + (p||''))
