import { useNavigate, Link, useParams } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import {
  Form,
  Input,
  Button,
  Card,
  Tabs,
  message,
  Select,
  Typography,
  Space,
} from 'antd'
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  SafetyOutlined,
} from '@ant-design/icons'
import { SIGNUP_MUTATION, LOGIN_MUTATION } from '../graphql/queries'
import { useTheme } from '../contexts/ThemeContext.jsx'

const { Title, Text } = Typography

const AuthPage = ({ type = 'civilian' }) => {
  const navigate = useNavigate()
  const { cityId } = useParams()
  const { colors, spacing, borderRadius } = useTheme()
  const [login, { loading: loginLoading }] = useMutation(LOGIN_MUTATION)
  const [signup, { loading: signupLoading }] = useMutation(SIGNUP_MUTATION)

  const onLogin = async values => {
    try {
      const { data } = await login({ variables: values })
      localStorage.setItem('token', data.login.token)
      localStorage.setItem('user', JSON.stringify(data.login.user))
      message.success('Login successful')
      if (data.login.user.role === 'council') {
        navigate(`/city/${cityId}/dashboard`)
      } else {
        navigate(`/city/${cityId}/my-reports`)
      }
    } catch (err) {
      message.error(err.message)
    }
  }

  const onSignup = async values => {
    try {
      const { data } = await signup({
        variables: { ...values, city: cityId?.toLowerCase() },
      })
      localStorage.setItem('token', data.signup.token)
      localStorage.setItem('user', JSON.stringify(data.signup.user))
      message.success('Account created')
      if (data.signup.user.role === 'council') {
        navigate(`/city/${cityId}/dashboard`)
      } else {
        navigate(`/city/${cityId}/my-reports`)
      }
    } catch (err) {
      message.error(err.message)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: colors.background,
        padding: spacing.md,
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '450px',
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: borderRadius.xl,
          boxShadow: `0 8px 32px ${colors.shadow}`,
        }}
        bodyStyle={{ padding: spacing.xl }}
      >
        <div style={{ textAlign: 'center', marginBottom: spacing.lg }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: `${colors.primary}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              marginBottom: spacing.md,
              fontSize: '2rem',
            }}
          >
            🔐
          </div>
          <Title
            level={3}
            style={{
              color: colors.text,
              marginBottom: spacing.sm,
              marginTop: 0,
            }}
          >
            {type === 'council'
              ? 'Council Access'
              : `Welcome to ${cityId?.charAt(0).toUpperCase() + cityId?.slice(1)}`}
          </Title>
          <Text style={{ color: colors.textSecondary, display: 'block' }}>
            Sign in to access your account
          </Text>
        </div>

        {type === 'council' ? (
          <Form
            name="login"
            onFinish={onLogin}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Email required' }]}
            >
              <Input
                prefix={<MailOutlined style={{ color: colors.textSecondary }} />}
                placeholder="Council Email"
                size="large"
                style={{
                  borderRadius: borderRadius.md,
                  background: colors.background,
                }}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Password required' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: colors.textSecondary }} />}
                placeholder="Password"
                size="large"
                style={{
                  borderRadius: borderRadius.md,
                  background: colors.background,
                }}
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loginLoading}
                size="large"
                style={{
                  height: '48px',
                  fontWeight: '600',
                  borderRadius: borderRadius.lg,
                  background: colors.primary,
                  borderColor: colors.primary,
                }}
              >
                Login to Dashboard
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Tabs
            defaultActiveKey="login"
            centered
            style={{ marginBottom: spacing.lg }}
            items={[
              {
                key: 'login',
                label: 'Login',
                children: (
                  <Form
                    name="login"
                    onFinish={onLogin}
                    layout="vertical"
                    requiredMark={false}
                  >
                    <Form.Item
                      name="email"
                      rules={[{ required: true, message: 'Email required' }]}
                    >
                      <Input
                        prefix={
                          <MailOutlined style={{ color: colors.textSecondary }} />
                        }
                        placeholder="Email"
                        size="large"
                        style={{
                          borderRadius: borderRadius.md,
                          background: colors.background,
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      rules={[{ required: true, message: 'Password required' }]}
                    >
                      <Input.Password
                        prefix={
                          <LockOutlined style={{ color: colors.textSecondary }} />
                        }
                        placeholder="Password"
                        size="large"
                        style={{
                          borderRadius: borderRadius.md,
                          background: colors.background,
                        }}
                      />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loginLoading}
                        size="large"
                        style={{
                          height: '48px',
                          fontWeight: '600',
                          borderRadius: borderRadius.lg,
                          background: colors.primary,
                          borderColor: colors.primary,
                        }}
                      >
                        Login
                      </Button>
                    </Form.Item>
                  </Form>
                ),
              },
              {
                key: 'signup',
                label: 'Sign Up',
                children: (
                  <Form
                    name="signup"
                    onFinish={onSignup}
                    layout="vertical"
                    requiredMark={false}
                  >
                    <Form.Item
                      name="name"
                      rules={[{ required: true, message: 'Name required' }]}
                    >
                      <Input
                        prefix={
                          <UserOutlined style={{ color: colors.textSecondary }} />
                        }
                        placeholder="Name"
                        size="large"
                        style={{
                          borderRadius: borderRadius.md,
                          background: colors.background,
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="email"
                      rules={[{ required: true, message: 'Email required' }]}
                    >
                      <Input
                        prefix={
                          <MailOutlined style={{ color: colors.textSecondary }} />
                        }
                        placeholder="Email"
                        size="large"
                        style={{
                          borderRadius: borderRadius.md,
                          background: colors.background,
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      rules={[{ required: true, message: 'Password required' }]}
                    >
                      <Input.Password
                        prefix={
                          <LockOutlined style={{ color: colors.textSecondary }} />
                        }
                        placeholder="Password"
                        size="large"
                        style={{
                          borderRadius: borderRadius.md,
                          background: colors.background,
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="role"
                      initialValue="civilian"
                      hidden
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={signupLoading}
                        size="large"
                        style={{
                          height: '48px',
                          fontWeight: '600',
                          borderRadius: borderRadius.lg,
                          background: colors.primary,
                          borderColor: colors.primary,
                        }}
                      >
                        Create Account
                      </Button>
                    </Form.Item>
                  </Form>
                ),
              },
            ]}
          />
        )}

        <div
          style={{
            textAlign: 'center',
            borderTop: `1px solid ${colors.border}`,
            paddingTop: spacing.lg,
          }}
        >
          <Link to={`/city/${cityId}`}>
            <Text
              style={{ color: colors.textSecondary, transition: 'color 0.2s' }}
            >
              ← Back to {cityId?.charAt(0).toUpperCase() + cityId?.slice(1)}
            </Text>
          </Link>
        </div>
      </Card>
    </div>
  )
}

export default AuthPage
