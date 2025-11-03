import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/,'') || 'http://localhost:8383'
const api = axios.create({ baseURL: API_URL, withCredentials: true, headers:{'Content-Type':'application/json'} })
let refreshing=null
api.interceptors.response.use(r=>r, async (error)=>{
  const { config, response } = error
  if(response && response.status===401 && !config.__retry){
    try{
      if(!refreshing){ refreshing = api.post('/auth/refresh').then(r=>r.data.accessToken).finally(()=>refreshing=null) }
      const token = await refreshing
      if(token){ config.__retry=true; config.headers={...(config.headers||{}), Authorization:`Bearer ${token}`}; localStorage.setItem('accessToken',token); return api.request(config) }
    }catch(_){}
  }
  return Promise.reject(error)
})
export function setAuthToken(token){ if(token){ api.defaults.headers.common['Authorization']=`Bearer ${token}`; localStorage.setItem('accessToken',token) } else { delete api.defaults.headers.common['Authorization']; localStorage.removeItem('accessToken') } }
export { api, API_URL }
