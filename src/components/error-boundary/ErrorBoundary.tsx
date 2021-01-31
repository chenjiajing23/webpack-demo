import React, { Component, ErrorInfo } from 'react';
import { Button } from 'antd';

import './error-boundary.less';

interface IProps {
  [key: string]: any;
}

interface IState {
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });
    console.error(error, errorInfo);
  }

  onReload = () => {
    window.location.reload();
  };

  render() {
    const { error, errorInfo } = this.state;

    return errorInfo ? (
      <section styleName="component-error-boundary">
        <div styleName="info">
          <h2 styleName="title">Something went wrong ~~~ ^··^</h2>
          <Button type="primary" danger onClick={this.onReload}>
            重新加载
          </Button>
        </div>
        <details styleName="detail">
          {error && error.toString()}
          <br />
          {errorInfo && errorInfo.componentStack}
        </details>
      </section>
    ) : (
        this.props.children
      );
  }
}

export default ErrorBoundary;
