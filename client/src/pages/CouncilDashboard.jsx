import { useState, useEffect } from 'react'
import { Layout, Typography, Card, Tag, Button, Row, Col, message, Modal, Badge } from 'antd'
import { ReloadOutlined, CheckCircleOutlined, UserOutlined } from '@ant-design/icons'
import { useParams } from 'react-router-dom'

const { Header, Content } = Layout
const { Title, Text, Paragraph } = Typography

export default function CouncilDashboard() {
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(false)
    const { cityId } = useParams()
    const cityName = cityId.charAt(0).toUpperCase() + cityId.slice(1)

    const fetchReports = async () => {
        setLoading(true)
        try {
            const res = await fetch(`http://localhost:5000/api/reports?city=${cityName}`)
            const data = await res.json()
            setReports(data)
        } catch (err) {
            message.error('Failed to load reports')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReports()
    }, [])

    const updateStatus = async (id, newStatus, currentDept) => {
        try {
            await fetch(`http://localhost:5000/api/reports/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, department: currentDept }),
            })
            message.success(`Status updated to ${newStatus}`)
            fetchReports()
        } catch (err) {
            message.error('Update failed')
        }
    }

    const KanbanColumn = ({ title, status, items }) => (
        <Col span={8}>
            <Card title={`${title} (${items.length})`} style={{ background: '#f0f2f5', minHeight: '80vh' }}>
                {items.map(report => (
                    <ReportCard key={report._id} report={report} />
                ))}
            </Card>
        </Col>
    )

    const ReportCard = ({ report }) => {
        const ai = report.aiAnalysis || {}

        return (
            <Card
                style={{ marginBottom: 16 }}
                title={<Badge status={report.status === 'Completed' ? 'success' : 'processing'} text={report.department} />}
                extra={<Tag color={ai.severity === 'High' ? 'red' : 'blue'}>{ai.severity}</Tag>}
                actions={[
                    report.status === 'Not Started' && <Button onClick={() => updateStatus(report._id, 'Assigned', report.department)}>Assign</Button>,
                    report.status === 'Assigned' && <Button type="primary" onClick={() => updateStatus(report._id, 'Completed', report.department)}>Complete</Button>,
                ].filter(Boolean)}
            >
                <Text strong>Issue:</Text>
                <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}>
                    {report.originalDescription}
                </Paragraph>

                <Text type="secondary" style={{ fontSize: '12px' }}>
                    <EnvironmentOutlined /> {report.location}
                </Text>

                <div style={{ marginTop: 10, padding: 8, background: '#fffbe6', borderRadius: 4, fontSize: '12px' }}>
                    <Text strong>AI Thought Process:</Text>
                    <Paragraph style={{ marginBottom: 0 }}>{ai.thoughts || 'N/A'}</Paragraph>
                </div>
            </Card>
        )
    }

    // Icon component helper
    const EnvironmentOutlined = () => <span role="img" aria-label="environment">📍</span>

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Title level={3} style={{ color: '#fff', margin: 0 }}>{cityName} Council Dashboard</Title>
                <Button icon={<ReloadOutlined />} onClick={fetchReports}>Refresh</Button>
            </Header>
            <Content style={{ padding: '24px' }}>
                <Row gutter={16}>
                    <KanbanColumn
                        title="Not Started"
                        status="Not Started"
                        items={reports.filter(r => r.status === 'Not Started')}
                    />
                    <KanbanColumn
                        title="Assigned"
                        status="Assigned"
                        items={reports.filter(r => r.status === 'Assigned')}
                    />
                    <KanbanColumn
                        title="Completed"
                        status="Completed"
                        items={reports.filter(r => r.status === 'Completed')}
                    />
                </Row>
            </Content>
        </Layout>
    )
}
