/**
 * 首页组件
 */
import { Button, Card, Typography, Space } from 'antd'
import { LoginOutlined, UserAddOutlined, FileTextOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph } = Typography

const IndexPage: React.FC = () => {
  const navigate = useNavigate()

  // 检查是否已登录
  const isLoggedIn = localStorage.getItem('token')

  return (
    <div
      style={{
        padding: '24px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card style={{ maxWidth: 600, textAlign: 'center' }}>
        <Title level={2}>个人知识库管理系统</Title>

        {/* 登录/注册按钮区 */}
        {!isLoggedIn && (
          <div style={{ marginTop: 32 }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Paragraph style={{ fontSize: 16, marginBottom: 16 }}>
                欢迎使用个人知识库系统，请先登录或注册
              </Paragraph>
              <Space size="large">
                <Button
                  type="primary"
                  size="large"
                  icon={<LoginOutlined />}
                  onClick={() => navigate('/login')}
                >
                  登录
                </Button>
                <Button
                  size="large"
                  icon={<UserAddOutlined />}
                  onClick={() => navigate('/register')}
                >
                  注册
                </Button>
              </Space>
            </Space>
          </div>
        )}

        {/* 已登录用户进入仪表板 */}
        {isLoggedIn && (
          <div style={{ marginTop: 32 }}>
            <Button
              type="primary"
              size="large"
              icon={<FileTextOutlined />}
              onClick={() => navigate('/dashboard')}
            >
              进入仪表板
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

export default IndexPage
