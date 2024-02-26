// 客户端使用的 axios 工具函数

import { TOKEN_KEY, TOKEN_STORAGE_KEY } from '@/const/common'
import axios from 'axios'

export const http = axios.create({
  timeout: 10000,
})

http.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    config.baseURL = window.location.origin

    const token = window.localStorage.getItem(TOKEN_STORAGE_KEY)
    if (token) {
      config.headers[TOKEN_KEY] = token
    }
  }

  return config
})
