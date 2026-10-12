import { Component } from 'react';
export default class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (!this.state.error) return this.props.children;
    return this.props.inline
      ? <div className="poster">3D unavailable / مدل سه‌بعدی بارگذاری نشد</div>
      : <pre style={{ padding: 16, whiteSpace: 'pre-wrap', direction: 'ltr' }}>{String(this.state.error?.stack || this.state.error)}</pre>;
  }
}
