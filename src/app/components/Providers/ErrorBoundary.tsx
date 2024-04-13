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
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{this.state.error.toString()}</span>
        </div>
      );
    }
    return this.props.children;
  }
}
