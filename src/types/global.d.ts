import { HashHistory, State } from 'history'

declare global {
  interface Window {
    router: HashHistory<State>
  }
}
