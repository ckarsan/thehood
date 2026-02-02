import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
} from 'react-router-dom'
import { Layout, Typography, Button } from 'antd'
import ReportForm from './pages/ReportForm'
import CouncilDashboard from './pages/CouncilDashboard'
import CitySelection from './pages/CitySelection'
import AuthPage from './pages/AuthPage'
import UserDashboard from './pages/UserDashboard'
import NavBar from './components/NavBar'
import ProtectedRoute from './components/ProtectedRoute'
import { useTheme } from './contexts/ThemeContext.jsx'
import './App.css'

const { Content, Footer } = Layout
const { Text } = Typography

function CityLanding() {
  const { cityId } = useParams()
  const { colors, spacing, borderRadius } = useTheme()
  const cityName = cityId.charAt(0).toUpperCase() + cityId.slice(1)

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          fontWeight: '800',
          color: colors.text,
          margin: 0,
          marginBottom: spacing.md,
          lineHeight: 1.1,
        }}
      >
        {cityName}
        <span style={{ color: colors.primary }}>Needs You</span>
      </h1>
      <p
        style={{
          fontSize: 'clamp(1rem, 2vw, 1.5rem)',
          color: colors.textSecondary,
          marginBottom: spacing.xl,
          maxWidth: '600px',
          lineHeight: 1.6,
        }}
      >
        Every hero needs a sidekick. Help keep {cityName} safe by reporting
        issues directly to the City Council.
      </p>
      <Link to={`/city/${cityId}/report`}>
        <Button
          type="primary"
          size="large"
          style={{
            height: '56px',
            fontSize: '1.1rem',
            fontWeight: '600',
            borderRadius: borderRadius.lg,
            padding: '0 32px',
            background: colors.primary,
            borderColor: colors.primary,
          }}
        >
          File a Report
        </Button>
      </Link>
      <div
        style={{
          marginTop: spacing.xl,
          display: 'flex',
          gap: spacing.xl,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <Text
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: colors.primary,
            }}
          >
            Fast
          </Text>
          <Text
            style={{
              display: 'block',
              color: colors.textSecondary,
              marginTop: spacing.xs,
            }}
          >
            Quick reporting
          </Text>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Text
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: colors.primary,
            }}
          >
            AI
          </Text>
          <Text
            style={{
              display: 'block',
              color: colors.textSecondary,
              marginTop: spacing.xs,
            }}
          >
            Smart routing
          </Text>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Text
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: colors.primary,
            }}
          >
            Track
          </Text>
          <Text
            style={{
              display: 'block',
              color: colors.textSecondary,
              marginTop: spacing.xs,
            }}
          >
            Real-time updates
          </Text>
        </div>
      </div>
    </div>
  )
}

function App() {
  const { colors } = useTheme()

  return (
    <Router>
      <div
        style={{
          background: colors.warning,
          color: 'white',
          textAlign: 'center',
          padding: '4px 0',
          fontWeight: '600',
          fontSize: '0.85rem',
          letterSpacing: '0.02em',
          position: 'relative',
          zIndex: 1001,
        }}
      >
        DEMONSTRATION ONLY • DATA IS NOT SUBMITTED TO ANY COUNCIL OR GOVERNMENT ENTITY
      </div>
      <Layout style={{ minHeight: '100vh', background: colors.background }}>
        <NavBar />
        <Content>
          <Routes>
            <Route path="/" element={<CitySelection />} />
            <Route path="/city/:cityId" element={<CityLanding />} />
            <Route
              path="/city/:cityId/report"
              element={
                <ProtectedRoute>
                  <ReportForm />
                </ProtectedRoute>
              }
            />
            <Route path="/city/:cityId/auth" element={<AuthPage type="civilian" />} />
            <Route
              path="/city/:cityId/council/auth"
              element={<AuthPage type="council" />}
            />
            <Route
              path="/city/:cityId/my-reports"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/city/:cityId/dashboard"
              element={
                <ProtectedRoute>
                  <CouncilDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
            background: colors.surface,
            borderTop: `1px solid ${colors.border}`,
            padding: '24px 0',
          }}
        >
          <Text style={{ color: colors.textSecondary }}>
            theHood Platform ©2026
          </Text>
        </Footer>
      </Layout>
    </Router>
  )
}

export default App
