import axios from 'axios'

// 根据环境变量决定 baseURL
const baseURL = import.meta.env.VITE_USE_MOCK === 'true'
  ? ''               // mock 模式下，baseURL 为空，走本地 mock
  : '/api'           // 联调时，vite proxy 会把 /api 转发到后端

const instance = axios.create({
  baseURL,
  timeout: 10000
})

instance.interceptors.response.use(
  res => res.data,   // 直接返回 data，省一层
  err => Promise.reject(err)
)

export default instance