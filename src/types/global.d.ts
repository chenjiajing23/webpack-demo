import { History } from 'history'

declare global {
  interface Window {
    router: History<History.PoorMansUnknown>
  }
}
