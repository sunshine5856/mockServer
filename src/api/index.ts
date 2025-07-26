import axios from 'axios'
import type { AxiosInstance } from 'axios'

const isMock = import.meta.env.DEV
const baseURL = isMock ? '' : '/api-real'   // 开发时自动区分

const instance: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000
})

export default instance