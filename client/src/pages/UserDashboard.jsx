import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import {
  Layout,
  Typography,
  Card,
  Tag,
  Button,
  Input,
  message,
  Modal,
  List,
  Avatar,
  Space,
  Empty,
} from 'antd'
import {
  ArrowLeftOutlined,
  PlusOutlined,
  CommentOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { GET_REPORTS, ADD_REPORT_NOTE_MUTATION } from '../graphql/queries'
import { useTheme } from '../contexts/ThemeContext.jsx'

const { Header, Content } = Layout
const { Title, Text, Paragraph } = Typography

export default function UserDashboard() {
  const [selectedReport, setSelectedReport] = useState(null)
  const [noteInput, setNoteInput] = useState('')
  const { cityId } = useParams()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')
  const { colors, spacing, borderRadius } = useTheme()

  const { data, loading, refetch } = useQuery(GET_REPORTS, {
    variables: { city: cityId?.toLowerCase(), userId: user.id },
    fetchPolicy: 'cache-and-network',
    skip: !token,
  })

  const [addNote] = useMutation(ADD_REPORT_NOTE_MUTATION, {
    onCompleted: () => {
      message.success('Note added')
      setNoteInput('')
      refetch()
    },
    onError: err => message.error(err.message),
  })

  const reports = data?.reports || []

  const handleAddNote = () => {
    if (!noteInput.trim() || !selectedReport) return
    addNote({ variables: { reportId: selectedReport.id, text: noteInput } })
  }

  const getStatusConfig = status => {
    switch (status) {
      case 'Completed':
        return { color: colors.success, icon: <CheckCircleOutlined /> }
      case 'Assigned':
        return { color: colors.primary, icon: <ClockCircleOutlined /> }
      default:
        return { color: colors.textSecondary, icon: <ClockCircleOutlined /> }
    }
  }

  const ReportCard = ({ report }) => {
    const statusConfig = getStatusConfig(report.status)

    return (
      <Card
        style={{
          marginBottom: spacing.md,
          cursor: 'pointer',
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: borderRadius.lg,
          transition: 'all 0.2s',
        }}
        bodyStyle={{ padding: spacing.lg }}
        hoverable
        onClick={() => setSelectedReport(report)}
      >
        <Space direction="vertical" style={{ width: '100%' }} size={spacing.sm}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: spacing.sm,
              flexWrap: 'wrap',
            }}
          >
            <Space size={spacing.sm}>
              <Tag
                color={statusConfig.color}
                icon={statusConfig.icon}
                style={{
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                }}
              >
                {report.status}
              </Tag>
              <Tag
                color={colors.primary}
                style={{
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                }}
              >
                {report.department}
              </Tag>
            </Space>
            <Text
              code
              style={{ color: colors.textSecondary, fontSize: '0.8rem' }}
            >
              {report.referenceNumber}
            </Text>
          </div>
          <Text strong style={{ color: colors.text, fontSize: '1rem' }}>
            Issue:
          </Text>
          <Paragraph
            ellipsis={{ rows: 2 }}
            style={{ color: colors.text, marginBottom: 0 }}
          >
            {report.originalDescription}
          </Paragraph>
          <Space size={spacing.sm}>
            <span style={{ color: colors.textSecondary, fontSize: '0.9rem' }}>
              📍 {report.location}
            </span>
          </Space>
          {report.resolution?.completedBy && (
            <div
              style={{
                padding: spacing.md,
                background: `${colors.success}10`,
                borderRadius: borderRadius.md,
                border: `1px solid ${colors.success}30`,
              }}
            >
              <Text type="success" strong style={{ color: colors.success }}>
                ✓ Resolved by {report.resolution.completedBy.name}
              </Text>
              <Paragraph
                style={{
                  color: colors.text,
                  marginBottom: 0,
                  marginTop: spacing.xs,
                }}
              >
                {report.resolution.notes}
              </Paragraph>
            </div>
          )}
        </Space>
      </Card>
    )
  }

  return (
    <Layout style={{ minHeight: '100vh', background: colors.background }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.md,
          padding: `0 ${spacing.lg}`,
          background: colors.background,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <Link to={`/city/${cityId}`}>
          <Button
            icon={<ArrowLeftOutlined />}
            type="text"
            style={{ color: colors.text }}
          />
        </Link>
        <Space size="middle" style={{ display: 'flex', alignItems: 'center' }}>
          <Title
            level={3}
            style={{
              color: colors.text,
              margin: 0,
              fontWeight: '700',
            }}
          >
            My Reports
          </Title>
          <Text style={{ color: colors.textSecondary, fontSize: '1.1rem', fontWeight: '500' }}>
            ({cityId?.toUpperCase()})
          </Text>
        </Space>
      </Header>
      <Content style={{ padding: spacing.xl }}>
        <Card
          title={
            <Space>
              <Text strong style={{ color: colors.text, fontSize: '1.1rem' }}>
                Your Reports
              </Text>
              <Tag
                color={colors.primary}
                style={{
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                }}
              >
                {reports.length}
              </Tag>
            </Space>
          }
          style={{
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: borderRadius.xl,
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          {loading ? (
            <div style={{ textAlign: 'center', padding: spacing.xxl }}>
              <Text style={{ color: colors.textSecondary }}>
                Loading reports...
              </Text>
            </div>
          ) : reports.length === 0 ? (
            <Empty
              description={
                <div>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      display: 'block',
                      fontSize: '1rem',
                      marginBottom: spacing.md,
                    }}
                  >
                    No reports yet
                  </Text>
                  <Link to={`/city/${cityId}/report`}>
                    <Button type="primary" icon={<PlusOutlined />}>
                      Submit Your First Report
                    </Button>
                  </Link>
                </div>
              }
            />
          ) : (
            reports.map(report => (
              <ReportCard key={report.id} report={report} />
            ))
          )}
        </Card>

        <Modal
          title={
            <Space>
              <CommentOutlined />
              <span>Report Details</span>
            </Space>
          }
          open={!!selectedReport}
          onCancel={() => {
            setSelectedReport(null)
            setNoteInput('')
          }}
          footer={null}
          width={700}
          styles={{
            content: {
              background: colors.surface,
              borderRadius: borderRadius.xl,
            },
            header: {
              background: colors.surface,
              borderBottom: `1px solid ${colors.border}`,
            },
          }}
        >
          {selectedReport && (
            <div>
              <div style={{ marginBottom: spacing.lg }}>
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                  }}
                >
                  Reference Number
                </Text>
                <div>
                  <Text
                    code
                    style={{ color: colors.text, fontSize: '0.95rem' }}
                  >
                    {selectedReport.referenceNumber}
                  </Text>
                </div>
              </div>

              <Space size={spacing.sm} wrap>
                <Tag
                  color={getStatusConfig(selectedReport.status).color}
                  icon={getStatusConfig(selectedReport.status).icon}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    fontSize: '0.9rem',
                  }}
                >
                  {selectedReport.status}
                </Tag>
                <Tag
                  color={colors.primary}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    fontSize: '0.9rem',
                  }}
                >
                  {selectedReport.department}
                </Tag>
                <Tag
                  color={
                    selectedReport.aiAnalysis?.severity === 'High'
                      ? colors.error
                      : colors.warning
                  }
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    fontSize: '0.9rem',
                  }}
                >
                  {selectedReport.aiAnalysis?.severity}
                </Tag>
              </Space>

              <div style={{ marginTop: spacing.lg }}>
                <Text
                  strong
                  style={{
                    color: colors.text,
                    display: 'block',
                    marginBottom: spacing.sm,
                  }}
                >
                  Description
                </Text>
                <Paragraph style={{ color: colors.text }}>
                  {selectedReport.originalDescription}
                </Paragraph>
              </div>

              <div>
                <Text
                  strong
                  style={{
                    color: colors.text,
                    display: 'block',
                    marginBottom: spacing.sm,
                  }}
                >
                  Location
                </Text>
                <Paragraph
                  style={{ color: colors.textSecondary, marginBottom: 0 }}
                >
                  📍 {selectedReport.location}
                </Paragraph>
              </div>

              {selectedReport.aiAnalysis?.thoughts && (
                <div
                  style={{
                    padding: spacing.md,
                    background: `${colors.warning}10`,
                    borderRadius: borderRadius.md,
                    border: `1px solid ${colors.warning}30`,
                    marginTop: spacing.md,
                  }}
                >
                  <Text
                    strong
                    style={{
                      color: colors.warning,
                      display: 'block',
                      marginBottom: spacing.xs,
                    }}
                  >
                    🤖 AI Analysis
                  </Text>
                  <Paragraph
                    style={{
                      color: colors.text,
                      marginBottom: 0,
                      fontSize: '0.9rem',
                    }}
                  >
                    {selectedReport.aiAnalysis.thoughts}
                  </Paragraph>
                </div>
              )}

              {selectedReport.resolution && (
                <div
                  style={{
                    padding: spacing.md,
                    background: `${colors.success}10`,
                    borderRadius: borderRadius.md,
                    border: `1px solid ${colors.success}30`,
                    marginTop: spacing.md,
                  }}
                >
                  <Text
                    strong
                    style={{
                      color: colors.success,
                      display: 'block',
                      marginBottom: spacing.xs,
                    }}
                  >
                    ✓ Resolution
                  </Text>
                  <Paragraph
                    style={{ color: colors.text, marginBottom: spacing.xs }}
                  >
                    By: {selectedReport.resolution.completedBy?.name}
                  </Paragraph>
                  <Paragraph style={{ color: colors.text, marginBottom: 0 }}>
                    {selectedReport.resolution.notes}
                  </Paragraph>
                </div>
              )}

              <div style={{ marginTop: spacing.lg }}>
                <Text
                  strong
                  style={{
                    color: colors.text,
                    display: 'block',
                    marginBottom: spacing.md,
                  }}
                >
                  Notes ({selectedReport.notes.length})
                </Text>
                {selectedReport.notes.length === 0 ? (
                  <Text style={{ color: colors.textSecondary }}>
                    No notes yet
                  </Text>
                ) : (
                  <List
                    dataSource={selectedReport.notes}
                    renderItem={note => (
                      <List.Item
                        style={{ display: 'block', padding: `${spacing.sm} 0` }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            gap: spacing.sm,
                            alignItems: 'flex-start',
                          }}
                        >
                          <Avatar style={{ background: colors.primary }}>
                            {note.author?.name?.[0] || '?'}
                          </Avatar>
                          <div style={{ flex: 1 }}>
                            <Text strong style={{ color: colors.text }}>
                              {note.author?.name}
                            </Text>
                            <Paragraph
                              style={{
                                color: colors.text,
                                marginBottom: spacing.xs,
                                marginTop: 0,
                              }}
                            >
                              {note.text}
                            </Paragraph>
                            <Text
                              style={{
                                color: colors.textSecondary,
                                fontSize: '0.8rem',
                              }}
                            >
                              {new Date(note.createdAt).toLocaleString()}
                            </Text>
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                )}
              </div>

              <div
                style={{
                  marginTop: spacing.lg,
                  borderTop: `1px solid ${colors.border}`,
                  paddingTop: spacing.lg,
                }}
              >
                <Input.TextArea
                  rows={3}
                  value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                  placeholder="Add a note..."
                  style={{
                    borderRadius: borderRadius.md,
                    background: colors.background,
                  }}
                />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddNote}
                  style={{
                    marginTop: spacing.sm,
                    borderRadius: borderRadius.md,
                  }}
                  block
                >
                  Add Note
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </Content>
    </Layout>
  )
}
