import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'https://<your-backend>.onrender.com';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 120000, // 120s علشان وقت الـ cold start
});

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

api.interceptors.response.use(
  r => r,
  async (error) => {
    const cfg = error.config;
    const retriable =
      !error.response || // no response (backend لسه صاحي)
      error.code === 'ECONNABORTED' || // timeout
      [502,503,504].includes(error.response?.status);

    if (!cfg || !retriable || (cfg.__retryCount || 0) >= 5) {
      return Promise.reject(error);
    }
    cfg.__retryCount = (cfg.__retryCount || 0) + 1;
    const delay = 1000 * Math.pow(2, cfg.__retryCount); // 1s,2s,4s,8s,16s
    window.dispatchEvent(new CustomEvent('app-status', { detail: `Waking server… try ${cfg.__retryCount}/5` }));
    await sleep(delay);
    return api.request(cfg);
  }
);
