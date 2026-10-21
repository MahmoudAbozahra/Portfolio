import React from 'react';

class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) { return { error }; }

  componentDidCatch(error, info) {
    console.error('Admin panel failed to render', error, info);
  }

  componentDidUpdate(previousProps) {
    if (previousProps.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null });
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="admin-error-state" role="alert">
        <span>Panel unavailable</span>
        <h2>This section could not be displayed.</h2>
        <p>{this.state.error.message || 'An unexpected rendering error occurred.'}</p>
        <button type="button" onClick={() => this.setState({ error: null })}>Try this section again</button>
      </div>
    );
  }
}

export default AdminErrorBoundary;
