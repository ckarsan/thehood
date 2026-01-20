import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams, useNavigate } from 'react-router-dom'
import { Layout, Menu, Button } from 'antd'
import ReportForm from './pages/ReportForm'
import CouncilDashboard from './pages/CouncilDashboard'
import CitySelection from './pages/CitySelection'
import './App.css'

const { Header, Content, Footer } = Layout

function NavBar() {
  const location = useLocation()
  const { pathname } = location

  // Extract cityId from path if present
  const pathParts = pathname.split('/')
  const cityId = pathParts[1] === 'city' ? pathParts[2] : null
  const cityName = cityId ? cityId.charAt(0).toUpperCase() + cityId.slice(1) : ''

  if (pathname === '/' || !cityId) return <Header style={{ background: '#001529' }}><div style={{ color: 'white' }}>theHood</div></Header>
  if (pathname.includes('/dashboard')) return null

  return (
    <Header style={{ display: 'flex', alignItems: 'center', background: '#001529' }}>
      <div className="demo-logo" style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem', marginRight: '20px' }}>
        <Link to="/" style={{ color: 'white' }}>theHood</Link> &gt; {cityName}
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['1']}
        style={{ flex: 1, minWidth: 0 }}
        items={[
          { key: '1', label: <Link to={`/city/${cityId}`}>Audit</Link> }, // Home for city
          { key: '2', label: <Link to={`/city/${cityId}/report`}>Report Issue</Link> },
          { key: '3', label: <Link to={`/city/${cityId}/portal`}>Council Login</Link> },
        ]}
      />
    </Header>
  )
}

function CityLanding() {
  const { cityId } = useParams()
  const cityName = cityId.charAt(0).toUpperCase() + cityId.slice(1)

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1 style={{ fontSize: '4rem', color: '#fff' }}>{cityName.toUpperCase()} NEEDS YOU</h1>
      <p style={{ fontSize: '1.5rem', color: '#ccc' }}>
        See something wrong in {cityName}? Report it directly.
      </p>
      <Link to={`/city/${cityId}/report`}>
        <Button type="primary" size="large" style={{ marginTop: '20px', height: '50px', fontSize: '1.2rem' }}>
          FILE A REPORT
        </Button>
      </Link>
    </div>
  )
}

function PortalLogin() {
  const { cityId } = useParams()
  return (
    <div style={{ textAlign: 'center', padding: '100px', color: '#fff' }}>
      <h2>Council Officer Portal ({cityId})</h2>
      <Link to={`/city/${cityId}/dashboard`}>
        <Button type="primary" size="large" danger>Access Secure Dashboard</Button>
      </Link>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh', background: '#0f172a' }}>
        <NavBar />
        <Content>
          <Routes>
            <Route path="/" element={<CitySelection />} />
            <Route path="/city/:cityId" element={<CityLanding />} />
            <Route path="/city/:cityId/report" element={<ReportForm />} />
            <Route path="/city/:cityId/portal" element={<PortalLogin />} />
            <Route path="/city/:cityId/dashboard" element={<CouncilDashboard />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center', background: '#001529', color: '#888' }}>
          theHood Platform ©2026
        </Footer>
      </Layout>
    </Router>
  )
}

export default App
