import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

// ErrorBoundary must be a class component, hooks cannot catch render errors
class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production: send to Sentry or similar
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <p className="text-neutral-500 text-sm">Something went wrong.</p>
          <button
            onClick={() => this.setState({ error: null })}
            className="mt-4 text-sm text-orange-500 hover:underline"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
