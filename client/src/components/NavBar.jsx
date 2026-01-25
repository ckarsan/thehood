import { Link, useLocation } from 'react-router-dom'
import { Layout, Button, Space, Typography } from 'antd'
import { MoonOutlined, SunOutlined } from '@ant-design/icons'
import { useTheme } from '../contexts/ThemeContext.jsx'

const { Header } = Layout
const { Text } = Typography

export default function NavBar() {
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
            {/* <Button
        icon={isDark ? <SunOutlined /> : <MoonOutlined />}
        onClick={toggleTheme}
        type="text"
        style={{ marginLeft: 'auto' }}
      /> */}
        </Header>
    )
}
