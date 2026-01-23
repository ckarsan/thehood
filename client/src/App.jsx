import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useParams,
} from 'react-router-dom'
import { Layout, Button, Space, Typography } from 'antd'
import { MoonOutlined, SunOutlined } from '@ant-design/icons'
import ReportForm from './pages/ReportForm'
import CouncilDashboard from './pages/CouncilDashboard'
import CitySelection from './pages/CitySelection'
import AuthPage from './pages/AuthPage'
import UserDashboard from './pages/UserDashboard'
import { useTheme } from './contexts/ThemeContext.jsx'
import './App.css'

const { Header, Content, Footer } = Layout
const { Text } = Typography

function NavBar() {
  const location = useLocation()
  const { pathname } = location
  const { isDark, toggleTheme, colors } = useTheme()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const pathParts = pathname.split('/')
  const cityId = pathParts[1] === 'city' ? pathParts[2] : null
  const cityName = cityId
    ? cityId.charAt(0).toUpperCase() + cityId.slice(1)
    : ''

  if (pathname === '/' || !cityId) {
    return (
      <Header
        style={{
          background: 'transparent',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link to="/">
          <Text
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: colors.text,
            }}
          >
            theHood
          </Text>
        </Link>
        <Button
          icon={isDark ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleTheme}
          type="text"
        />
      </Header>
    )
  }

  if (pathname.includes('/dashboard') || pathname.includes('/my-reports')) {
    return null
  }

  const navItems = [
    { key: '1', label: 'Overview', to: `/city/${cityId}` },
    { key: '2', label: 'Report Issue', to: `/city/${cityId}/report` },
    { key: '3', label: 'My Reports', to: `/city/${cityId}/my-reports` },
    {
      key: '4',
      label: user.role === 'council' ? 'Council Dashboard' : 'Council Login',
      to: `/city/${cityId}${user.role === 'council' ? '/dashboard' : '/auth'}`,
    },
  ]

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        background: colors.surface,
        borderBottom: `1px solid ${colors.border}`,
        padding: '0 24px',
      }}
    >
      <Link to="/" style={{ marginRight: '24px' }}>
        <Text
          style={{ fontSize: '1.2rem', fontWeight: 'bold', color: colors.text }}
        >
          theHood
        </Text>
      </Link>
      <Text style={{ color: colors.textSecondary, marginRight: '16px' }}>
        /
      </Text>
      <Text
        style={{ color: colors.text, marginRight: '32px', fontWeight: '500' }}
      >
        {cityName}
      </Text>
      <Space size="large">
        {navItems.map(item => (
          <Link key={item.key} to={item.to}>
            <Text
              style={{
                color:
                  pathname === item.to ? colors.primary : colors.textSecondary,
                transition: 'color 0.2s',
                fontWeight: pathname === item.to ? '600' : '400',
              }}
            >
              {item.label}
            </Text>
          </Link>
        ))}
      </Space>
      <Button
        icon={isDark ? <SunOutlined /> : <MoonOutlined />}
        onClick={toggleTheme}
        type="text"
        style={{ marginLeft: 'auto' }}
      />
    </Header>
  )
}

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
      <Layout style={{ minHeight: '100vh', background: colors.background }}>
        <NavBar />
        <Content>
          <Routes>
            <Route path="/" element={<CitySelection />} />
            <Route path="/city/:cityId" element={<CityLanding />} />
            <Route path="/city/:cityId/report" element={<ReportForm />} />
            <Route path="/city/:cityId/auth" element={<AuthPage />} />
            <Route
              path="/city/:cityId/my-reports"
              element={<UserDashboard />}
            />
            <Route
              path="/city/:cityId/dashboard"
              element={<CouncilDashboard />}
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
