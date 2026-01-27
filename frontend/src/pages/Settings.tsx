/**
 * 设置页面
 * 用户偏好设置、主题配置等
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Form, Input, Button, Typography, Divider, Radio, Space, message, Row, Col, Spin, Upload, Avatar } from 'antd'
import {
  UserOutlined,
  MailOutlined,
  BgColorsOutlined,
  SaveOutlined,
  LockOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { useTheme } from '../contexts/ThemeContext'
import { authAPI } from '../services/api'
import { useBreakpoint } from '../hooks/useBreakpoint'
import type { UserProfile } from '../types'

const { Title, Text } = Typography

interface SettingsFormValues {
  username: string
  email?: string
}

interface PasswordFormValues {
  old_password: string
  new_password: string
  confirm_password: string
}

const Settings: React.FC = () => {
  const { isDark, toggleTheme, primaryColor, changePrimaryColor, themeMode, setThemeMode } = useTheme()
  const navigate = useNavigate()
  const isMobile = useBreakpoint()
  const [form] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false)
  const [pageLoading, setPageLoading] = useState<boolean>(true)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [avatarUploading, setAvatarUploading] = useState<boolean>(false)

  // 预设主题色
  const presetColors = [
    { name: '拂晓蓝', value: '#1890ff' },
    { name: '薄暮', value: '#722ed1' },
    { name: '火山', value: '#fa541c' },
    { name: '日暮', value: '#faad14' },
    { name: '明青', value: '#13c2c2' },
    { name: '极光绿', value: '#52c41a' },
    { name: '极客蓝', value: '#2f54eb' },
    { name: '酱紫', value: '#9254de' },
  ]

  // 加载用户信息
  useEffect(() => {
    loadUserInfo()
  }, [])

  const loadUserInfo = async () => {
    setPageLoading(true)
    try {
      const userInfo = await authAPI.getProfile()

      setUserProfile(userInfo)

      if (userInfo.avatar_url) {
        localStorage.setItem('avatar', userInfo.avatar_url)
        // 触发自定义事件通知其他组件
        window.dispatchEvent(new Event('avatarUpdated'))
      }

      form.setFieldsValue({
        username: userInfo.username,
        email: userInfo.email || '',
      })
    } catch (error) {
      console.error('加载用户信息失败:', error)
    } finally {
      setPageLoading(false)
    }
  }

  // 头像上传处理
  const handleAvatarUpload: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError } = options
    setAvatarUploading(true)
    try {
      const result = await authAPI.uploadAvatar(file as File)
      message.success('头像上传成功')

      // 更新用户信息
      if (userProfile) {
        const updatedProfile = { ...userProfile, avatar_url: result.avatar_url }
        setUserProfile(updatedProfile)
        localStorage.setItem('avatar', result.avatar_url)
        // 触发自定义事件通知其他组件
        window.dispatchEvent(new Event('avatarUpdated'))
      }
      onSuccess?.(result)
    } catch (error) {
      message.error('头像上传失败')
      onError?.(error as Error)
    } finally {
      setAvatarUploading(false)
    }
  }

  // 修改密码处理
  const handleChangePassword = async (values: PasswordFormValues) => {
    setPasswordLoading(true)
    try {
      await authAPI.changePassword({
        old_password: values.old_password,
        new_password: values.new_password,
      })
      message.success('密码修改成功，请重新登录')
      passwordForm.resetFields()

      // 延迟1秒后自动登出并跳转到登录页
      setTimeout(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        localStorage.removeItem('avatar')
        navigate('/login')
      }, 1000)
    } catch (error) {
      message.error('密码修改失败，请检查原密码是否正确')
    } finally {
      setPasswordLoading(false)
    }
  }

  // 头像上传前的验证
  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      message.error('只能上传图片文件')
      return false
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB')
      return false
    }
    return true
  }

  // 更新个人信息
  const handleUpdateProfile = async (values: SettingsFormValues) => {
    setLoading(true)
    try {
      await authAPI.updateProfile(values)
      localStorage.setItem('username', values.username)
      message.success('个人信息更新成功')
    } catch (error) {
      message.error('更新失败')
    } finally {
      setLoading(false)
    }
  }

  // 处理主题切换
  const handleThemeChange = (value: string) => {
    setThemeMode(value)
    toggleTheme(value)
  }

  if (pageLoading) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div style={{ padding: isMobile ? '12px' : '24px', maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2}>设置</Title>

      <Row gutter={[24, 24]}>
        {/* 个人信息设置 */}
        <Col xs={24} lg={12}>
          <Card title={
            <Space>
              <UserOutlined />
              <span>个人信息</span>
            </Space>
          }>
            {/* 头像上传 */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar
                size={80}
                src={userProfile?.avatar_url || localStorage.getItem('avatar')}
                icon={<UserOutlined />}
                style={{ marginBottom: 12 }}
              />
              <div>
                <Upload
                  customRequest={handleAvatarUpload}
                  beforeUpload={beforeUpload}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />} loading={avatarUploading}>
                    更换头像
                  </Button>
                </Upload>
                <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
                  支持 JPG、PNG 格式，文件大小不超过 2MB
                </Text>
              </div>
            </div>

            <Divider />

            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateProfile}
            >
              <Form.Item
                label="用户名"
                name="username"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 3, message: '用户名至少3个字符' },
                  { max: 20, message: '用户名最多20个字符' },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="用户名" />
              </Form.Item>

              <Form.Item
                label="邮箱"
                name="email"
                rules={[
                  { type: 'email', message: '请输入有效的邮箱地址' },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="邮箱地址" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                  保存个人信息
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* 密码修改 */}
        <Col xs={24} lg={12}>
          <Card title={
            <Space>
              <LockOutlined />
              <span>修改密码</span>
            </Space>
          }>
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handleChangePassword}
            >
              <Form.Item
                label="原密码"
                name="old_password"
                rules={[{ required: true, message: '请输入原密码' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="请输入原密码" />
              </Form.Item>

              <Form.Item
                label="新密码"
                name="new_password"
                rules={[
                  { required: true, message: '请输入新密码' },
                  { min: 6, message: '密码至少6个字符' },
                  { max: 20, message: '密码最多20个字符' },
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="请输入新密码（至少6个字符）" />
              </Form.Item>

              <Form.Item
                label="确认新密码"
                name="confirm_password"
                dependencies={['new_password']}
                rules={[
                  { required: true, message: '请再次输入新密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('new_password') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'))
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="请再次输入新密码" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={passwordLoading}>
                  修改密码
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* 主题设置 */}
        <Col xs={24} lg={12}>
          <Card title={
            <Space>
              <BgColorsOutlined />
              <span>主题设置</span>
            </Space>
          }>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {/* 主题模式 */}
              <div>
                <Text strong style={{ marginBottom: 16, display: 'block' }}>
                  主题模式
                </Text>
                <Radio.Group
                  value={themeMode}
                  onChange={(e) => handleThemeChange(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Radio value="light">
                      <Space>
                        <span>☀️</span>
                        <span>亮色模式</span>
                      </Space>
                    </Radio>
                    <Radio value="dark">
                      <Space>
                        <span>🌙</span>
                        <span>暗色模式</span>
                      </Space>
                    </Radio>
                    <Radio value="system">
                      <Space>
                        <span>💻</span>
                        <span>跟随系统</span>
                      </Space>
                    </Radio>
                  </Space>
                </Radio.Group>
              </div>

              <Divider />

              {/* 主题色 */}
              <div>
                <Text strong style={{ marginBottom: 16, display: 'block' }}>
                  主题色
                </Text>
                <Row gutter={[12, 12]}>
                  {presetColors.map((color) => (
                    <Col key={color.value} span={6}>
                      <div
                        onClick={() => changePrimaryColor(color.value)}
                        style={{
                          backgroundColor: color.value,
                          height: 60,
                          borderRadius: 8,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: 12,
                          position: 'relative',
                          border: primaryColor === color.value ? '3px solid #000' : '3px solid transparent',
                        }}
                      >
                        {color.name}
                        {primaryColor === color.value && (
                          <div style={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            width: 16,
                            height: 16,
                            backgroundColor: '#fff',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            ✓
                          </div>
                        )}
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Space>
          </Card>
        </Col>

        {/* 关于 */}
        <Col span={24}>
          <Card title="关于">
            <Space direction="vertical">
              <Text>个人知识库管理系统 v1.0.0</Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Settings
