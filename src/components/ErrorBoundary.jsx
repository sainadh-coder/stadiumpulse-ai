/**
 * ErrorBoundary isolates a role experience so a rendering failure does not take down the
 * shared navigation or the other StadiumPulse experiences.
 */
import { Component } from 'react'

/** @typedef {{ children: import('react').ReactNode, title: string }} ErrorBoundaryProps */
export default class ErrorBoundary extends Component {
  /** @param {ErrorBoundaryProps} props */
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError)
      return (
        <main className="mx-auto max-w-3xl px-4 py-12">
          <section className="glass rounded-3xl p-6 text-center">
            <h1 className="display text-3xl">{this.props.title} is temporarily unavailable</h1>
            <p className="mt-3 text-sm text-slate-600">Please refresh to restore this live experience.</p>
          </section>
        </main>
      )
    return this.props.children
  }
}
