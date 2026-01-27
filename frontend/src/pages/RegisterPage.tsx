/**
 * 注册页面组件
 */
import { useState } from 'react'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { authAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

interface RegisterFormValues {
  username: string
  email: string
  password: string
  confirmPassword: string
}

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const onFinish = async (values: RegisterFormValues) => {
    if (values.password !== values.confirmPassword) {
      message.error('两次输入的密码不一致')
      return
    }

    setLoading(true)

    try {
      // 调用注册 API
      await authAPI.register({
        username: values.username,
        email: values.email,
        password: values.password,
      })

      message.success('注册成功，请登录')
      navigate('/login')
    } catch (error) {
      message.error('注册失败，用户名可能已存在')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--ant-colorBgLayout)',
      }}
    >
      <Card
        style={{
          width: 400,
          padding: '40px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2}>注册账户</Title>
          <Text type="secondary">创建您的个人知识库账户</Text>
        </div>

        <Form name="register" onFinish={onFinish} autoComplete="off" size="large">
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名!' },
              { min: 3, message: '用户名至少3个字符' },
              { max: 20, message: '用户名最多20个字符' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名（3-20个字符）" size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱地址!' },
              { type: 'email', message: '请输入有效的邮箱地址!' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="邮箱地址" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码!' },
              { min: 6, message: '密码至少6个字符' },
              { max: 50, message: '密码最多50个字符' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码（6-50个字符）"
              size="large"
              maxLength={50}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码!' },
              { max: 50, message: '密码最多50个字符' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不一致!'))
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="确认密码"
              size="large"
              maxLength={50}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              注册
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">
              已有账户？ <a onClick={() => navigate('/login')}>立即登录</a>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default RegisterPage
