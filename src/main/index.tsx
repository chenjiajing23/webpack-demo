import React from 'react'
import ReactDOM from 'react-dom'
import { createHashHistory } from 'history'

window.router = createHashHistory()

import App from './app'

ReactDOM.render(<App />, document.getElementById('app'))
