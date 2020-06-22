import React, { Component, ErrorInfo } from 'react'

import './error-boundary.less'

interface IProps {
  [key: string]: any
}

interface IState {
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<IProps, IState> {
  state = { error: null, errorInfo: null }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })
    console.error(error, errorInfo)
  }

  render() {
    const { error, errorInfo } = this.state

    return errorInfo ? (
      <section styleName="component-error-boundary">
        <h2 styleName="title">Something went wrong ~~~ ^··^</h2>
        <details styleName="detail">
          {error && ((error as unknown) as Error).toString()}
          <br />
          {errorInfo && ((errorInfo as unknown) as ErrorInfo).componentStack}
        </details>
      </section>
    ) : (
      this.props.children
    )
  }
}

export default ErrorBoundary
