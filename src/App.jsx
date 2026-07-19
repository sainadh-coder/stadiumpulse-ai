import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ErrorBoundary from './components/ErrorBoundary'
import Landing from './pages/Landing'
const Fan = lazy(() => import('./pages/Fan'))
const Volunteer = lazy(() => import('./pages/Volunteer'))
const Organizer = lazy(() => import('./pages/Organizer'))

function RolePage({ title, children }) {
  return (
    <ErrorBoundary title={title}>
      <Suspense
        fallback={<main className="mx-auto max-w-7xl px-4 py-12 text-sm text-slate-600">Loading {title}…</main>}
      >
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/fan"
          element={
            <RolePage title="Fan Copilot">
              <Fan />
            </RolePage>
          }
        />
        <Route
          path="/volunteer"
          element={
            <RolePage title="Volunteer Copilot">
              <Volunteer />
            </RolePage>
          }
        />
        <Route
          path="/organizer"
          element={
            <RolePage title="Organizer Dashboard">
              <Organizer />
            </RolePage>
          }
        />
        <Route path="*" element={<Landing />} />
      </Routes>
    </Layout>
  )
}
