/* eslint-disable react/prop-types */
import { Component } from "react";
import ErrorPage from "../pages/ErrorPage";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // eslint-disable-next-line no-unused-vars
  static getDerivedStateFromError(error) {
    // Update state to display fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service (optional)
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // Display custom error page when an error is caught
      return <ErrorPage statusCode={500} message="Something went wrong!" />;
    }

    // Otherwise, render the children components as normal
    return this.props.children;
  }
}

export default ErrorBoundary;
