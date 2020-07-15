import { History } from 'history'
import { AxiosInstance } from 'axios'

declare global {
  interface Window {
    router: History<History.PoorMansUnknown>
    apis: AxiosInstance
  }
}
