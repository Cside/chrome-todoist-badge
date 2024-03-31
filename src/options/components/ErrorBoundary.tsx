import React, { type ReactNode } from "react";

type State =
  | {
      hasError: true;
      error: Error;
    }
  | {
      hasError: false;
      error: undefined;
    };

export class ErrorBoundary extends React.Component<{ children: ReactNode }, State> {
  override state: State = {
    hasError: false,
    error: undefined,
  };

  /** @public */
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div>
          <pre>{this.state.error.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
