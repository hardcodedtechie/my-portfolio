import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message ?? String(error) };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16, color: "white", fontFamily: "monospace" }}>
          <h2 style={{ marginBottom: 8 }}>Something crashed.</h2>
          <pre style={{ whiteSpace: "pre-wrap", opacity: 0.8 }}>
            {this.state.message}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
