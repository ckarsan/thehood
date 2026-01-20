import { useState } from 'react'
import {
    Form,
    Input,
    Button,
    Upload,
    Typography,
    Card,
    message,
    Layout,
    Steps,
} from 'antd'
import { UploadOutlined, EnvironmentOutlined } from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'

const { Title, Paragraph } = Typography
const { Content } = Layout

export default function ReportForm() {
    const [form] = Form.useForm()
    const { cityId } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    // Capitalize cityId for display
    const cityName = cityId.charAt(0).toUpperCase() + cityId.slice(1)

    const onFinish = async values => {
        setLoading(true)
        try {
            // In a real app, handle image uploads to cloud storage first.
            // Here we just mock it or send empty array.
            const payload = {
                city: cityName, // Send city name to backend
                description: values.description,
                location: values.location,
                civilianContact: {
                    name: values.name,
                    phone: values.phone,
                    email: values.email,
                },
                images: [], // Placeholder
            }

            const res = await fetch('http://localhost:5000/api/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (res.ok) {
                message.success('Report submitted successfully! The Council will review it.')
                navigate(`/city/${cityId}`)
            } else {
                message.error('Failed to submit report. Please try again.')
            }
        } catch (err) {
            console.error(err)
            message.error('System error.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Content style={{ padding: '0 50px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ margin: '30px 0' }}>
                <Title level={2} style={{ color: '#fff' }}>Submit a Report to {cityName}</Title>
                <Paragraph style={{ color: '#ccc' }}>
                    Help us fix {cityName}. Report potholes, graffiti, or other issues.
                    Our AI system will analyze and route your report to the right department.
                </Paragraph>
            </div>

            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    requiredMark="optional"
                >
                    <Form.Item
                        name="description"
                        label="What is the issue?"
                        rules={[{ required: true, message: 'Please describe the issue' }]}
                    >
                        <Input.TextArea
                            rows={4}
                            placeholder="e.g. There is a large pothole on Main St..."
                        />
                    </Form.Item>

                    <Form.Item
                        name="location"
                        label="Location"
                        rules={[{ required: true, message: 'Please specify the location' }]}
                    >
                        <Input
                            prefix={<EnvironmentOutlined />}
                            placeholder="123 Wayne Avenue"
                        />
                    </Form.Item>

                    <Form.Item label="Upload Images (Optional)">
                        <Upload listType="picture" maxCount={3}>
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>

                    <Title level={5}>Your Contact Details (Optional)</Title>
                    <Form.Item name="name" label="Name">
                        <Input placeholder="Bruce Wayne" />
                    </Form.Item>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <Form.Item name="phone" label="Phone">
                            <Input placeholder="555-0123" />
                        </Form.Item>
                        <Form.Item name="email" label="Email">
                            <Input placeholder="bruce@wayne.com" />
                        </Form.Item>
                    </div>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block size="large">
                            Submit Report
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Content>
    )
}
