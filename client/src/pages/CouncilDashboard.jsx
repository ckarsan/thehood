import { useState } from 'react'
import {
  Layout,
  Typography,
  Card,
  Tag,
  Button,
  Row,
  Col,
  message,
  Modal,
  Space,
  Empty,
  Badge,
  Input,
  Divider,
  Drawer,
} from 'antd'
import {
  ReloadOutlined,
  PlusOutlined,
  BulbOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CommentOutlined,
  SafetyOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_REPORTS,
  UPDATE_REPORT_STATUS_MUTATION,
  RESOLVE_REPORT_MUTATION,
  ADD_REPORT_NOTE_MUTATION,
  GET_REPORT_BY_REFERENCE,
} from '../graphql/queries'
import { useTheme } from '../contexts/ThemeContext.jsx'

const { Header, Content } = Layout
const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

export default function CouncilDashboard() {
  const [selectedReport, setSelectedReport] = useState(null)
  const [aiReport, setAiReport] = useState(null)
  const [resolutionNotes, setResolutionNotes] = useState('')
  const [noteInput, setNoteInput] = useState('')
  const [duplicateRef, setDuplicateRef] = useState(null)
  const { cityId } = useParams()
  const navigate = useNavigate()
  const { colors, spacing, borderRadius } = useTheme()
  const cityName = cityId?.charAt(0).toUpperCase() + cityId.slice(1)

  // Redirect if not council
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (user.role !== 'council') {
    navigate(`/city/${cityId}/council/auth`)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    message.success('Logged out successfully')
    navigate(`/city/${cityId}`)
  }

  const { data, refetch } = useQuery(GET_REPORTS, {
    variables: { city: cityId?.toLowerCase() },
    fetchPolicy: 'cache-and-network',
  })

  const [updateReportStatus] = useMutation(UPDATE_REPORT_STATUS_MUTATION, {
    onCompleted: () => {
      message.success('Status updated')
      refetch()
    },
    onError: err => message.error(err.message),
  })

  const [resolveReport] = useMutation(RESOLVE_REPORT_MUTATION, {
    onCompleted: () => {
      message.success('Report resolved')
      setResolutionNotes('')
      setSelectedReport(null)
      refetch()
    },
    onError: err => message.error(err.message),
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

  const { data: duplicateData, loading: duplicateLoading } = useQuery(GET_REPORT_BY_REFERENCE, {
    variables: { referenceNumber: duplicateRef },
    skip: !duplicateRef,
  })

  const duplicate = duplicateData?.reportByReference

  const DuplicateDetailsDrawer = () => (
    <Drawer
      title={
        <Space>
          <InfoCircleOutlined />
          <span>Duplicate Details: {duplicateRef}</span>
        </Space>
      }
      placement="right"
      width={600}
      onClose={() => setDuplicateRef(null)}
      open={!!duplicateRef}
      styles={{
        body: { background: colors.background },
        header: { borderBottom: `1px solid ${colors.border}` }
      }}
    >
      {duplicateLoading ? (
        <div style={{ textAlign: 'center', padding: spacing.xl }}>
          <ReloadOutlined spin style={{ fontSize: '2rem', color: colors.primary }} />
          <div style={{ marginTop: spacing.md }}>Fetching details...</div>
        </div>
      ) : duplicate ? (
        <div>
          <Card
            size="small"
            title={<Text strong>Original Report</Text>}
            style={{ marginBottom: spacing.md, background: colors.surface }}
          >
            <Paragraph>{duplicate.originalDescription}</Paragraph>
            <Text type="secondary">📍 {duplicate.location}</Text>
          </Card>

          <Card
            size="small"
            title={<Text strong>AI Status</Text>}
            style={{ marginBottom: spacing.md, background: colors.surface }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong>Status:</Text>
                <Tag color={getStatusConfig(duplicate.status).color}>{duplicate.status}</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong>Department:</Text>
                <Tag color={colors.primary}>{duplicate.department}</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong>Severity:</Text>
                <Tag color={colors.error}>{duplicate.aiAnalysis?.severity}</Tag>
              </div>
            </Space>
          </Card>

          {duplicate.status === 'resolved' && duplicate.resolution?.timestamp && (
            <Card
              size="small"
              title={<Text strong>Resolution</Text>}
              style={{ background: `${colors.success}10`, borderColor: colors.success + '40', marginTop: spacing.md }}
            >
              <Paragraph style={{ marginBottom: spacing.xs }}>{duplicate.resolution.notes || 'No resolution notes provided.'}</Paragraph>
              <Text type="secondary" style={{ fontSize: '0.8rem' }}>
                Resolved on {new Date(duplicate.resolution.timestamp).toLocaleDateString()}
              </Text>
            </Card>
          )}

          <Divider />
          <Button block onClick={() => setDuplicateRef(null)}>Close Drawer</Button>
        </div>
      ) : (
        <Empty description="Report details not found" />
      )}
    </Drawer>
  )

  const handleStatusUpdate = (id, newStatus, department) => {
    updateReportStatus({ variables: { id, status: newStatus, department } })
  }

  const handleResolve = () => {
    if (!resolutionNotes.trim()) {
      message.error('Please add resolution notes')
      return
    }
    resolveReport({
      variables: { id: selectedReport.id, notes: resolutionNotes },
    })
  }

  const handleAddNote = () => {
    if (!noteInput.trim()) return
    addNote({ variables: { reportId: selectedReport.id, text: noteInput } })
  }

  const getStatusConfig = status => {
    switch (status) {
      case 'resolved':
        return {
          color: colors.success,
          icon: <CheckCircleOutlined />,
          bg: `${colors.success}10`,
          label: 'Resolved'
        }
      case 'in-progress':
        return {
          color: colors.warning,
          icon: <ClockCircleOutlined />,
          bg: `${colors.warning}10`,
          label: 'In Progress'
        }
      case 'assigned':
        return {
          color: colors.primary,
          icon: <SafetyOutlined />,
          bg: `${colors.primary}10`,
          label: 'Assigned'
        }
      case 'cancelled':
        return {
          color: colors.error,
          icon: <CheckCircleOutlined />, // or something else
          bg: `${colors.error}10`,
          label: 'Cancelled'
        }
      case 'submitted':
      default:
        return {
          color: colors.textSecondary,
          icon: <ClockCircleOutlined />,
          bg: 'transparent',
          label: 'Submitted'
        }
    }
  }

  const KanbanColumn = ({ title, status, items, isLast }) => {
    const statusConfig = getStatusConfig(status)

    return (
      <Col style={{ width: '320px', flex: '0 0 320px', position: 'relative', padding: `0 ${spacing.md}` }}>
        {!isLast && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: '2%',
              bottom: '2%',
              width: '1px',
              background: colors.border,
              opacity: 0.8
            }}
          />
        )}
        <Card
          title={
            <div style={{ padding: '8px 0' }}>
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusConfig.color }} />
                  <Text strong style={{ fontSize: '1rem', color: colors.text }}>{title}</Text>
                  <Badge
                    count={items.length}
                    showZero
                    color={items.length > 0 ? colors.primary : colors.border}
                    style={{ backgroundColor: items.length > 0 ? colors.primary : 'transparent', color: items.length > 0 ? '#fff' : colors.textSecondary, boxShadow: 'none', border: `1px solid ${colors.border}` }}
                  />
                </div>
              </Space>
            </div>
          }
          headStyle={{ borderBottom: `2px solid ${statusConfig.color}40`, padding: `0 ${spacing.md}` }}
          style={{
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: borderRadius.lg,
            minHeight: 'calc(100vh - 180px)',
          }}
          bodyStyle={{ padding: spacing.md }}
        >
          {items.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Text style={{ color: colors.textSecondary }}>No reports</Text>
              }
              style={{ marginTop: spacing.xl }}
            />
          ) : (
            items.map(report => <ReportCard key={report.id} report={report} />)
          )}
        </Card>
      </Col>
    )
  }

  const ReportCard = ({ report }) => {
    const ai = report.aiAnalysis || {}
    const statusConfig = getStatusConfig(report.status)

    return (
      <Card
        style={{
          marginBottom: spacing.md,
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: borderRadius.md,
          transition: 'all 0.2s',
        }}
        bodyStyle={{ padding: spacing.md }}
        hoverable
      >
        <Space direction="vertical" style={{ width: '100%' }} size={spacing.sm}>
          <div>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: '0.75rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}
            >
              REF:
            </Text>{' '}
            <Text code style={{ color: colors.text, fontSize: '0.8rem' }}>
              {report.referenceNumber}
            </Text>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: spacing.xs,
            }}
          >
            <Space size={spacing.xs} wrap>
              <Tag
                color={statusConfig.color}
                icon={statusConfig.icon}
                style={{
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                }}
              >
                {report.department}
              </Tag>
              <Tag
                color={
                  ai.severity === 'High'
                    ? colors.error
                    : ai.severity === 'Medium'
                      ? colors.warning
                      : colors.success
                }
                style={{
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                }}
              >
                {ai.severity}
              </Tag>
            </Space>
          </div>

          <Text
            strong
            style={{ color: colors.text, fontSize: '0.9rem', display: 'block' }}
          >
            Issue:
          </Text>
          <Paragraph
            ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
            style={{
              color: colors.text,
              marginBottom: spacing.xs,
              fontSize: '0.85rem',
            }}
          >
            {report.originalDescription}
          </Paragraph>

          <Space
            size={spacing.sm}
            split={<span style={{ color: colors.border }}>|</span>}
            style={{ color: colors.textSecondary, fontSize: '0.8rem' }}
          >
            <span>📍 {report.location}</span>
            {report.createdBy && <span>👤 {report.createdBy.name}</span>}
          </Space>

          <Space style={{ marginTop: spacing.sm }}>
            <Button
              size="small"
              icon={<InfoCircleOutlined />}
              onClick={() => setSelectedReport(report)}
              style={{ borderRadius: borderRadius.sm }}
            >
              Details
            </Button>
            <Button
              size="small"
              type="primary"
              ghost
              icon={<BulbOutlined />}
              onClick={() => setAiReport(report)}
              style={{ borderRadius: borderRadius.sm }}
            >
              AI Thoughts
            </Button>
          </Space>
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
          justifyContent: 'space-between',
          padding: `0 ${spacing.lg}`,
          background: colors.background,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div>
          <Title
            level={3}
            style={{
              color: colors.text,
              margin: 0,
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
            }}
          >
            <SafetyOutlined style={{ color: colors.primary }} />
            {cityName} Council Dashboard
          </Title>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
            style={{ borderRadius: borderRadius.md }}
          >
            Refresh
          </Button>
          <Button
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ borderRadius: borderRadius.md }}
          >
            Logout
          </Button>
        </Space>
      </Header>
      <Content style={{ padding: spacing.lg, overflowY: 'hidden' }}>
        <div style={{
          overflowX: 'auto',
          height: 'calc(100vh - 140px)',
          paddingBottom: spacing.md,
          display: 'flex'
        }}>
          <Row gutter={0} wrap={false} style={{ flex: 1 }}>
            <KanbanColumn
              title="Submitted"
              status="submitted"
              items={reports.filter(r => r.status === 'submitted')}
            />
            <KanbanColumn
              title="In Review"
              status="in-review"
              items={reports.filter(r => r.status === 'in-review')}
            />
            <KanbanColumn
              title="Assigned"
              status="assigned"
              items={reports.filter(r => r.status === 'assigned')}
            />
            <KanbanColumn
              title="In Progress"
              status="in-progress"
              items={reports.filter(r => r.status === 'in-progress')}
            />
            <KanbanColumn
              title="Resolved"
              status="resolved"
              items={reports.filter(r => r.status === 'resolved')}
            />
            <KanbanColumn
              title="Cancelled"
              status="cancelled"
              items={reports.filter(r => r.status === 'cancelled')}
              isLast
            />
          </Row>
        </div>
      </Content>

      <Modal
        title={
          <Space>
            <InfoCircleOutlined />
            <span>Report Details</span>
          </Space>
        }
        open={!!selectedReport}
        onCancel={() => {
          setSelectedReport(null)
          setResolutionNotes('')
          setNoteInput('')
        }}
        footer={
          selectedReport?.status === 'resolved' || selectedReport?.status === 'cancelled' ? null : (
            <Space>
              <Button
                danger
                onClick={() =>
                  handleStatusUpdate(
                    selectedReport.id,
                    'cancelled',
                    selectedReport.department
                  )
                }
                style={{ borderRadius: borderRadius.md }}
              >
                Cancel Report
              </Button>
              {selectedReport?.status === 'submitted' && (
                <Button
                  onClick={() =>
                    handleStatusUpdate(
                      selectedReport.id,
                      'in-review',
                      selectedReport.department
                    )
                  }
                  style={{ borderRadius: borderRadius.md }}
                >
                  Review
                </Button>
              )}
              {selectedReport?.status === 'in-review' && (
                <Button
                  onClick={() =>
                    handleStatusUpdate(
                      selectedReport.id,
                      'assigned',
                      selectedReport.department
                    )
                  }
                  style={{ borderRadius: borderRadius.md }}
                >
                  Assign
                </Button>
              )}
              {selectedReport?.status === 'assigned' && (
                <Button
                  onClick={() =>
                    handleStatusUpdate(
                      selectedReport.id,
                      'in-progress',
                      selectedReport.department
                    )
                  }
                  style={{ borderRadius: borderRadius.md }}
                >
                  Move to Progress
                </Button>
              )}
              {selectedReport?.status === 'in-progress' && (
                <Button
                  type="primary"
                  onClick={() => setResolutionNotes(prev => prev || '')}
                  style={{
                    borderRadius: borderRadius.md,
                    background: colors.primary,
                  }}
                >
                  Complete
                </Button>
              )}
            </Space>
          )
        }
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
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                }}
              >
                REFERENCE NUMBER
              </Text>
              <div style={{ marginTop: spacing.xs }}>
                <Text code style={{ color: colors.text, fontSize: '1rem' }}>
                  {selectedReport.referenceNumber}
                </Text>
              </div>
            </div>

            <Space size={spacing.sm} wrap style={{ marginBottom: spacing.lg }}>
              <Tag
                color={
                  selectedReport.aiAnalysis?.severity === 'High'
                    ? colors.error
                    : selectedReport.aiAnalysis?.severity === 'Medium'
                      ? colors.warning
                      : colors.success
                }
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '0.9rem',
                }}
              >
                {selectedReport.aiAnalysis?.severity}
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
            </Space>

            <Divider style={{ borderColor: colors.border }} />

            <div style={{ marginBottom: spacing.md }}>
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

            <div style={{ marginBottom: spacing.md }}>
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

            {selectedReport.createdBy && (
              <div style={{ marginBottom: spacing.md }}>
                <Space>
                  <UserOutlined style={{ color: colors.textSecondary }} />
                  <Text style={{ color: colors.text }}>
                    <Text strong>Submitted by: </Text>
                    {selectedReport.createdBy.name} (
                    {selectedReport.createdBy.email})
                  </Text>
                </Space>
              </div>
            )}

            {selectedReport.status !== 'resolved' && (
              <div
                style={{
                  marginTop: spacing.lg,
                  padding: spacing.lg,
                  background: colors.surfaceSecondary,
                  borderRadius: borderRadius.md,
                }}
              >
                <Text
                  strong
                  style={{
                    color: colors.text,
                    display: 'block',
                    marginBottom: spacing.sm,
                  }}
                >
                  Resolution Notes
                </Text>
                <TextArea
                  rows={3}
                  value={resolutionNotes}
                  onChange={e => setResolutionNotes(e.target.value)}
                  placeholder="Describe resolution..."
                  style={{
                    borderRadius: borderRadius.md,
                    background: colors.background,
                  }}
                />
                <Button
                  type="primary"
                  onClick={handleResolve}
                  style={{
                    marginTop: spacing.sm,
                    borderRadius: borderRadius.md,
                    width: '100%',
                  }}
                >
                  Mark as Complete
                </Button>
              </div>
            )}

            <Divider style={{ borderColor: colors.border }} />

            <div style={{ marginTop: spacing.lg }}>
              <Text
                strong
                style={{
                  color: colors.text,
                  display: 'block',
                  marginBottom: spacing.md,
                }}
              >
                <CommentOutlined /> Notes ({selectedReport.notes.length})
              </Text>
              {selectedReport.notes.length === 0 ? (
                <Text style={{ color: colors.textSecondary }}>
                  No notes yet
                </Text>
              ) : (
                selectedReport.notes.map((note, idx) => (
                  <div
                    key={note.id || idx}
                    style={{
                      marginBottom: spacing.md,
                      padding: spacing.md,
                      background: colors.surfaceSecondary,
                      borderRadius: borderRadius.md,
                    }}
                  >
                    <Text strong style={{ color: colors.text }}>
                      {note.author?.name}
                    </Text>
                    <Paragraph
                      style={{
                        color: colors.text,
                        marginBottom: spacing.xs,
                        marginTop: spacing.xs,
                      }}
                    >
                      {note.text}
                    </Paragraph>
                  </div>
                ))
              )}
              <div style={{ marginTop: spacing.md }}>
                <Input
                  placeholder="Add a note..."
                  value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                  onPressEnter={handleAddNote}
                  style={{
                    borderRadius: borderRadius.md,
                    background: colors.background,
                  }}
                />
                <Button
                  icon={<PlusOutlined />}
                  onClick={handleAddNote}
                  style={{
                    marginTop: spacing.sm,
                    borderRadius: borderRadius.md,
                  }}
                  size="small"
                >
                  Add Note
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title={
          <Space>
            <BulbOutlined />
            <span>AI Analysis - Opik Insights</span>
          </Space>
        }
        open={!!aiReport}
        onCancel={() => setAiReport(null)}
        footer={null}
        width={800}
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
        {aiReport && (
          <div>
            <div style={{ marginBottom: spacing.lg }}>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                }}
              >
                REFERENCE NUMBER
              </Text>
              <div style={{ marginTop: spacing.xs }}>
                <Text code style={{ color: colors.text, fontSize: '1rem' }}>
                  {aiReport.referenceNumber}
                </Text>
              </div>
            </div>

            <Card
              size="small"
              title={<Text strong>Original Report</Text>}
              style={{
                marginBottom: spacing.md,
                background: colors.surfaceSecondary,
                border: `1px solid ${colors.border}`,
              }}
            >
              <Paragraph style={{ color: colors.text, marginBottom: 0 }}>
                {aiReport.originalDescription}
              </Paragraph>
              <Text
                type="secondary"
                style={{ color: colors.textSecondary, fontSize: '0.9rem' }}
              >
                📍 {aiReport.location}
              </Text>
            </Card>

            <Card
              size="small"
              title={<Text strong>AI Processed Description</Text>}
              style={{
                marginBottom: spacing.md,
                background: colors.surfaceSecondary,
                border: `1px solid ${colors.border}`,
              }}
            >
              <Paragraph
                style={{
                  color: colors.text,
                  marginBottom: 0,
                  fontStyle: 'italic',
                }}
              >
                {aiReport.aiAnalysis?.cleanedText || 'N/A'}
              </Paragraph>
            </Card>

            <Card
              size="small"
              title={<Text strong>Classification Results</Text>}
              style={{
                marginBottom: spacing.md,
                background: colors.surfaceSecondary,
                border: `1px solid ${colors.border}`,
              }}
            >
              <Space
                direction="vertical"
                style={{ width: '100%' }}
                size={spacing.sm}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Text strong>Department:</Text>
                  <Tag color={colors.primary}>{aiReport.department}</Tag>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Text strong>Severity:</Text>
                  <Tag
                    color={
                      aiReport.aiAnalysis?.severity === 'High'
                        ? colors.error
                        : aiReport.aiAnalysis?.severity === 'Medium'
                          ? colors.warning
                          : colors.success
                    }
                  >
                    {aiReport.aiAnalysis?.severity}
                  </Tag>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Text strong>Duplicate Confidence:</Text>
                  <Text style={{ color: colors.textSecondary }}>
                    {Math.round((aiReport.aiAnalysis?.duplicateConfidence || 0) * 100)}%
                  </Text>
                </div>
                {aiReport.aiAnalysis?.possibleDuplicates?.length > 0 && (
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
                  >
                    <Text strong>Possible Duplicates:</Text>
                    <div style={{ textAlign: 'right' }}>
                      {aiReport.aiAnalysis.possibleDuplicates.map(ref => (
                        <div key={ref}>
                          <Button
                            type="link"
                            size="small"
                            onClick={() => setDuplicateRef(ref)}
                            style={{ padding: 0 }}
                          >
                            <Text code style={{ fontSize: '0.8rem', color: colors.primary }}>{ref}</Text>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Space>
            </Card>

            <Card
              size="small"
              title={
                <Space>
                  <CommentOutlined />
                  <Text strong>AI Reasoning (Opik Trace)</Text>
                </Space>
              }
              bordered
              style={{
                background: `${colors.warning}10`,
                borderColor: `${colors.warning}30`,
                borderRadius: borderRadius.md,
              }}
            >
              <Paragraph
                style={{
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  marginBottom: 0,
                  maxHeight: 250,
                  overflow: 'auto',
                  color: colors.text,
                  fontSize: '0.85rem',
                }}
              >
                {aiReport.aiAnalysis?.thoughts || 'No AI thoughts available'}
              </Paragraph>
            </Card>

            {aiReport.aiAnalysis?.thoughts?.includes('mocked') && (
              <div
                style={{
                  marginTop: spacing.md,
                  padding: spacing.md,
                  background: `${colors.warning}15`,
                  borderRadius: borderRadius.md,
                  border: `1px solid ${colors.warning}40`,
                }}
              >
                <Space>
                  <span>⚠️</span>
                  <Text type="warning" strong>
                    Note: This response was generated using fallback logic
                    (Local LLM unavailable). Full AI analysis was not available.
                  </Text>
                </Space>
              </div>
            )}
          </div>
        )}
      </Modal>
      <DuplicateDetailsDrawer />
    </Layout >
  )
}
