import axios, { AxiosResponse } from 'axios'

const apis = axios.create({
  baseURL: 'http://localhost:1234',
  timeout: 10 * 1000 // 超时毫秒
})

apis.interceptors.request.use(
  config => config,

  error => Promise.reject(error)
)

apis.interceptors.response.use(
  (res: AxiosResponse<any>) => {
    const data = res.data
    return data
  },
  err => {
    if (err.response) {
      switch (err.response.status) {
        case 401:
          break
        case 403:
          break
        default:
      }
      return Promise.reject(err.response)
    }

    return Promise.reject(err)
  }
)

export default apis
