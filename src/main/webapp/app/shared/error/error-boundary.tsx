import React from 'react';

interface IErrorBoundaryProps {
  readonly children: React.ReactNode;
}

interface IErrorBoundaryState {
  readonly error: any;
  readonly errorInfo: any;
}

class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
  readonly state: IErrorBoundaryState = { error: undefined, errorInfo: undefined };

  componentDidCatch(error, errorInfo) {
    console.error('smmm-errorcomponentDidCatch', errorInfo, error);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    const { error, errorInfo } = this.state;
    // console.error('smmm-render', errorInfo, error);
    if (error || errorInfo) {
      // console.error('smmm-errorbou', errorInfo, error);
    }
    if (errorInfo) {
      const errorDetails = DEVELOPMENT ? (
        <details className="preserve-space">
          {error && error.toString()}dddddd
          <br />
          <span>sqdqdqdqsdqsdsqdsdqd</span>
          {errorInfo.componentStack}
        </details>
      ) : undefined;
      return (
        <div>
          <h2 className="error">An unexpected error has occurredssssss.</h2>
          <span>sqdqdqdqsdqsdsqdsdqdddddddddddddd</span>
          {errorDetails}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
