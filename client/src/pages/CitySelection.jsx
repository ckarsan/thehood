import { useNavigate } from 'react-router-dom'
import { Card, Typography, Row, Col, Button, Layout } from 'antd'
import {
  EnvironmentOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { useTheme } from '../contexts/ThemeContext.jsx'

const { Title, Paragraph, Text } = Typography
const { Content } = Layout

const CITIES = [
  {
    id: 'gotham',
    name: 'Gotham',
    desc: 'The Dark Knight watches over us',
    icon: <SafetyOutlined />,
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
  },
  {
    id: 'smallville',
    name: 'Smallville',
    desc: 'Home of the Boy of Steel',
    icon: <ThunderboltOutlined />,
    gradient: 'linear-gradient(135deg, #065f46 0%, #134e4a 100%)',
  },
  {
    id: 'metropolis',
    name: 'Metropolis',
    desc: 'The City of Tomorrow',
    icon: <EnvironmentOutlined />,
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
  },
]

export default function CitySelection() {
  const navigate = useNavigate()
  const { colors, spacing, borderRadius } = useTheme()

  return (
    <Content
      style={{
        minHeight: 'calc(100vh - 160px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
      }}
    >
      <div
        style={{
          textAlign: 'center',
          marginBottom: spacing.xl,
          maxWidth: '700px',
        }}
      >
        <Title
          level={1}
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '800',
            color: colors.text,
            marginBottom: spacing.md,
          }}
        >
          Welcome to
          <span style={{ color: colors.primary }}> theHood</span>
        </Title>
        <Paragraph
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: colors.textSecondary,
            marginBottom: 0,
            lineHeight: 1.7,
          }}
        >
          Your community, your voice. Report issues directly to City Council and
          track progress in real-time. Powered by AI.
        </Paragraph>
      </div>

      <Row
        gutter={[spacing.lg, spacing.lg]}
        justify="center"
        style={{ width: '100%', maxWidth: '1200px' }}
      >
        {CITIES.map(city => (
          <Col key={city.id} xs={24} sm={12} md={8}>
            <Card
              hoverable
              style={{
                height: '100%',
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: borderRadius.xl,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
              }}
              bodyStyle={{ padding: 0 }}
              onClick={() => navigate(`/city/${city.id}`)}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = `0 20px 40px ${colors.shadow}`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div
                style={{
                  height: '160px',
                  background: city.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '4rem',
                }}
              >
                {city.icon}
              </div>
              <div style={{ padding: spacing.lg }}>
                <Title
                  level={3}
                  style={{
                    color: colors.text,
                    margin: `0 0 ${spacing.sm} 0`,
                    fontSize: '1.75rem',
                  }}
                >
                  {city.name}
                </Title>
                <Paragraph
                  style={{
                    color: colors.textSecondary,
                    marginBottom: spacing.lg,
                    minHeight: '48px',
                  }}
                >
                  {city.desc}
                </Paragraph>
                <Button
                  type="primary"
                  block
                  size="large"
                  style={{
                    height: '48px',
                    fontWeight: '600',
                    borderRadius: borderRadius.lg,
                    background: colors.primary,
                    borderColor: colors.primary,
                  }}
                >
                  Enter {city.name}
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <div
        style={{
          marginTop: spacing.xxl,
          display: 'flex',
          gap: spacing.xl,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: `${colors.primary}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              marginBottom: spacing.sm,
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🚀</span>
          </div>
          <Text
            style={{ color: colors.text, fontWeight: '500', display: 'block' }}
          >
            Fast
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: '0.9rem' }}>
            Submit in seconds
          </Text>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: `${colors.success}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              marginBottom: spacing.sm,
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🤖</span>
          </div>
          <Text
            style={{ color: colors.text, fontWeight: '500', display: 'block' }}
          >
            AI-Powered
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: '0.9rem' }}>
            Smart routing
          </Text>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: `${colors.warning}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              marginBottom: spacing.sm,
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>📊</span>
          </div>
          <Text
            style={{ color: colors.text, fontWeight: '500', display: 'block' }}
          >
            Trackable
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: '0.9rem' }}>
            Real-time status
          </Text>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: `${colors.error}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              marginBottom: spacing.sm,
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🔒</span>
          </div>
          <Text
            style={{ color: colors.text, fontWeight: '500', display: 'block' }}
          >
            Secure
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: '0.9rem' }}>
            Privacy first
          </Text>
        </div>
      </div>
    </Content>
  )
}
