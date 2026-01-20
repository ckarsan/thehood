import { useNavigate } from 'react-router-dom'
import { Card, Typography, Row, Col, Button, Layout } from 'antd'

const { Title, Paragraph } = Typography
const { Content } = Layout

const CITIES = [
    { id: 'gotham', name: 'Gotham', desc: 'The Dark Knight watches over us.' },
    { id: 'smallville', name: 'Smallville', desc: 'Home of the Superboy.' },
    { id: 'metropolis', name: 'Metropolis', desc: 'The City of Tomorrow.' },
]

export default function CitySelection() {
    const navigate = useNavigate()

    return (
        <Content style={{ padding: '50px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <Title style={{ color: '#fff', fontSize: '3.5rem' }}>Welcome to theHood</Title>
            <Paragraph style={{ color: '#aaa', fontSize: '1.2rem', marginBottom: '50px' }}>
                Select your city to report issues and access services.
            </Paragraph>

            <Row gutter={[32, 32]} justify="center">
                {CITIES.map(city => (
                    <Col key={city.id} xs={24} sm={12} md={8}>
                        <Card
                            hoverable
                            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid #444' }}
                            onClick={() => navigate(`/city/${city.id}`)}
                            cover={
                                <div style={{ height: 150, background: '#1f1f1f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Title level={2} style={{ color: '#fff', margin: 0 }}>{city.name}</Title>
                                </div>
                            }
                        >
                            <Card.Meta
                                description={<span style={{ color: '#ccc' }}>{city.desc}</span>}
                            />
                            <Button type="primary" block style={{ marginTop: 20 }}>Enter {city.name}</Button>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Content>
    )
}
