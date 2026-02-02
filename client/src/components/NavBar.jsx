import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Button, Space, Typography, message } from 'antd'
import { MoonOutlined, SunOutlined, LogoutOutlined } from '@ant-design/icons'
import { useTheme } from '../contexts/ThemeContext.jsx'

const { Header } = Layout
const { Text } = Typography

export default function NavBar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { pathname } = location
    const { isDark, toggleTheme, colors } = useTheme()
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    const pathParts = pathname.split('/')
    const cityId = pathParts[1] === 'city' ? pathParts[2] : null
    const cityName = cityId
        ? cityId.charAt(0).toUpperCase() + cityId.slice(1)
        : ''

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        message.success('Logged out successfully')
        navigate(`/city/${cityId}`)
    }

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
                {/* <Button
          icon={isDark ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleTheme}
          type="text"
        /> */}
            </Header>
        )
    }

    if (pathname.includes('/dashboard') || pathname.includes('/my-reports')) {
        return null
    }

    const isLoggedIn = user.token || localStorage.getItem('token')

    const NavLink = ({ to, label }) => (
        <Link to={to}>
            <Text
                style={{
                    color: pathname === to ? colors.primary : colors.textSecondary,
                    transition: 'color 0.2s',
                    fontWeight: pathname === to ? '600' : '400',
                }}
            >
                {label}
            </Text>
        </Link>
    )

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
            <div style={{ display: 'flex', alignItems: 'center' }}>
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
                    <NavLink to={`/city/${cityId}`} label="Overview" />
                    <NavLink to={`/city/${cityId}/report`} label="Report Issue" />
                    {isLoggedIn && (
                        <NavLink to={`/city/${cityId}/my-reports`} label="My Reports" />
                    )}
                </Space>
            </div>

            <div style={{ marginLeft: 'auto' }}>
                <Space size="large">
                    <NavLink
                        to={`/city/${cityId}${user.role === 'council' ? '/dashboard' : '/council/auth'}`}
                        label={user.role === 'council' ? 'Council Dashboard' : 'Council Login'}
                    />
                    {isLoggedIn && (
                        <Button
                            type="text"
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                            style={{ color: colors.textSecondary }}
                        >
                            Logout
                        </Button>
                    )}
                </Space>
            </div>
        </Header>
    )
}
