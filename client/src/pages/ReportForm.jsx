import { useState, useEffect } from 'react'
import {
  Form,
  Input,
  Button,
  Upload,
  Typography,
  Card,
  message,
  Layout,
  Space,
  Modal,
} from 'antd'
import {
  UploadOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { CREATE_REPORT_MUTATION } from '../graphql/queries'
import { useTheme } from '../contexts/ThemeContext.jsx'

const { Title, Paragraph, Text } = Typography
const { Content } = Layout

export default function ReportForm() {
  const [form] = Form.useForm()
  const { cityId } = useParams()
  const navigate = useNavigate()

  const { colors, spacing, borderRadius } = useTheme()


  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        form.setFieldsValue({
          name: user.name,
          email: user.email,
          phone: user.phone,
        })
      } catch (e) {
        // Ignore parsing errors
      }
    }
  }, [form])

  const [createReport, { loading }] = useMutation(CREATE_REPORT_MUTATION, {
    onCompleted: () => {
      message.success(
        'Report submitted successfully! The Council will review it.'
      )
      navigate(`/city/${cityId}/my-reports`)
    },
    onError: err => {
      message.error(err.message)
    },
  })

  const onFinish = async values => {
    createReport({
      variables: {
        description: values.description,
        location: values.location,
        city: cityId?.toLowerCase(),
        civilianContact: {
          name: values.name,
          phone: values.phone,
          email: values.email,
        },
        images: [],
      },
    })
  }

  return (
    <Content
      style={{
        padding: `${spacing.xl} ${spacing.md}`,
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: `${colors.primary}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: `0 auto ${spacing.md}`,
            fontSize: '2.5rem',
          }}
        >
          📝
        </div>
        <Title
          level={2}
          style={{
            color: colors.text,
            marginBottom: spacing.sm,
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          }}
        >
          Submit a Report to {cityId?.toUpperCase()}
        </Title>
        <Paragraph
          style={{
            color: colors.textSecondary,
            fontSize: '1.1rem',
            marginBottom: 0,
            lineHeight: 1.6,
          }}
        >
          Help us fix {cityId}. Report potholes, graffiti, or other issues. Our
          AI system will analyze and route your report to the right department.
        </Paragraph>
      </div>

      <Card
        style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: borderRadius.xl,
          boxShadow: `0 4px 12px ${colors.shadow}`,
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="description"
            label={
              <Text strong style={{ color: colors.text, fontSize: '0.95rem' }}>
                What's the issue?
              </Text>
            }
            rules={[{ required: true, message: 'Please describe the issue' }]}
          >
            <Input.TextArea
              rows={5}
              placeholder="e.g. There's a large pothole near the intersection of Main St and 5th Avenue..."
              style={{
                borderRadius: borderRadius.md,
                background: colors.background,
              }}
            />
          </Form.Item>

          <Form.Item
            name="location"
            label={
              <Text strong style={{ color: colors.text, fontSize: '0.95rem' }}>
                Location
              </Text>
            }
            rules={[{ required: true, message: 'Please specify the location' }]}
          >
            <Input
              prefix={
                <EnvironmentOutlined style={{ color: colors.textSecondary }} />
              }
              placeholder="123 Wayne Avenue"
              style={{
                borderRadius: borderRadius.md,
                background: colors.background,
              }}
            />
          </Form.Item>

          <Form.Item
            label={
              <Text strong style={{ color: colors.text }}>
                Upload Images (Optional)
              </Text>
            }
          >
            <Upload listType="picture" maxCount={3}>
              <Button
                icon={<UploadOutlined />}
                style={{
                  borderRadius: borderRadius.md,
                }}
              >
                Click to Upload
              </Button>
            </Upload>
          </Form.Item>

          <div
            style={{
              background: colors.surfaceSecondary,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              marginBottom: spacing.lg,
            }}
          >
            <Title
              level={5}
              style={{
                color: colors.text,
                marginBottom: spacing.md,
                marginTop: 0,
              }}
            >
              Your Contact Details
            </Title>
            <Space
              direction="vertical"
              style={{ width: '100%' }}
              size={spacing.md}
            >
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input
                  placeholder="Bruce Wayne"
                  style={{
                    borderRadius: borderRadius.md,
                    background: colors.background,
                  }}
                />
              </Form.Item>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: spacing.md,
                }}
              >
                <Form.Item name="phone" label="Phone (Optional)">
                  <Input
                    placeholder="555-0123"
                    style={{
                      borderRadius: borderRadius.md,
                      background: colors.background,
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, message: 'Please enter your email' }]}
                >
                  <Input
                    placeholder="bruce@wayne.com"
                    style={{
                      borderRadius: borderRadius.md,
                      background: colors.background,
                    }}
                  />
                </Form.Item>
              </div>
            </Space>
          </div>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              icon={<CheckCircleOutlined />}
              style={{
                height: '52px',
                fontSize: '1.05rem',
                fontWeight: '600',
                borderRadius: borderRadius.lg,
                background: colors.primary,
                borderColor: colors.primary,
              }}
            >
              Submit Report
            </Button>
          </Form.Item>
        </Form>
      </Card>

    </Content >
  )
}
