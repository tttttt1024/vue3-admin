import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'ant-design-vue'
import { encode } from 'js-base64'

//登录失效处理
export function handleLoginLoss() {
  localStorage.removeItem('token')
  const replaceURL = import.meta.env.DEV ? '&service=' + encode(window.APP_CONFIG.webUrl + '/') : ''
  const VITE_APP_BASE_PATH = import.meta.env.VITE_APP_BASE_PATH || ''
  //开发环境下将登录成功后地址改为本地
  if (window.location.pathname === VITE_APP_BASE_PATH + '/login') return
  window.location.replace(`${window.location.origin + VITE_APP_BASE_PATH}/login?appCode=${window.APP_CONFIG.appCode}${replaceURL}`)
  return
}

export class Request {
  instance: AxiosInstance
  baseConfig: AxiosRequestConfig = {
    baseURL: window.APP_CONFIG.baseUrl,
  }

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(Object.assign(this.baseConfig, config))

    //请求拦截
    this.instance.interceptors.request.use(
      async (config: any) => {
        const token = localStorage.getItem('token') as string
        const jwt = localStorage.getItem('jwt') as string
        if (token) {
          config.headers!.token = token
        }
        if (jwt) {
          config.headers!.jwt = jwt
        }
        if (config.url === '/casService/login') config.baseURL = window.APP_CONFIG.loginBaseUrl
        return config
      },
      (err: any) => {
        return Promise.reject(err)
      }
    )
    let logoutPopup = false
    //响应拦截
    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        const { data } = res
        localStorage.removeItem('jwt')
        if (res.headers.token) {
          localStorage.setItem('token', res.headers.token)
        }
        if (typeof data === 'object' && data !== null && data !== null && !(data instanceof Blob) && !(data instanceof ArrayBuffer)) {
          switch (data.code) {
            //用户登录过期
            case 401:
              if (!logoutPopup) {
                message.error('用户信息已过期，请重新登录')
                handleLoginLoss()
                logoutPopup = true
              }
              break
            default:
              data.code !== 200 && message.error(data.msg)
          }
        }
        return res.data
      },
      (err) => {
        let text = ''
        switch (err.response?.status) {
          case 400:
            text = '请求错误(400)'
            break
          case 401:
            text = '未授权，请重新登录(401)'
            break
          case 403:
            text = '拒绝访问(403)'
            break
          case 404:
            text = '请求出错(404)'
            break
          case 408:
            text = '请求超时(408)'
            break
          case 500:
            text = '服务器错误(500)'
            break
          case 501:
            text = '服务未实现(501)'
            break
          case 502:
            text = '网络错误(502)'
            break
          case 503:
            text = '服务不可用(503)'
            break
          case 504:
            text = '网络超时(504)'
            break
          case 505:
            text = 'HTTP版本不受支持(505)'
            break
          default:
            text = `连接出错(${err.response?.status || '请稍后重试'})!`
        }
        message.error(text)
        return Promise.reject(err.response)
      }
    )
  }

  public request = (config: AxiosRequestConfig): Promise<IResponse> => {
    return this.instance.request(config)
  }
}

const instance = new Request({})

export default instance.request
