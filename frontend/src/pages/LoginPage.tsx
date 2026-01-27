/**
 * 登录页面组件
 */
import { useState } from 'react'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { authAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'
import type { LoginFormValues } from '../types'

const { Title, Text } = Typography

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true)

    try {
      // 调用登录 API
      const response = await authAPI.login({
        username: values.username,
        password: values.password,
      })

      console.log('[Login] Response:', response)
      console.log('[Login] Token:', response.access_token.substring(0, 20) + '...')

      // 保存 Token
      localStorage.setItem('token', response.access_token)
      localStorage.setItem('username', values.username)

      console.log('[Login] Token saved to localStorage')

      message.success('登录成功')

      // 跳转到首页
      navigate('/dashboard')
    } catch (error) {
      console.error('[Login] Error:', error)
      message.error('登录失败，请检查用户名和密码')
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
          <Title level={2}>个人知识库</Title>
          <Text type="secondary">登录到您的账户</Text>
        </div>

        <Form name="login" onFinish={onFinish} autoComplete="off" size="large">
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名!' }]}>
            <Input prefix={<UserOutlined />} placeholder="用户名" size="large" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: '请输入密码!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              登录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">
              还没有账户？ <a href="/register">立即注册</a>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default LoginPage
