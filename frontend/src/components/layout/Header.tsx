/**
 * 顶部导航栏组件
 * 包含 Logo、导航链接、主题切换和用户菜单
 */
import { Layout, Button, Dropdown, Avatar, Space, Typography } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SunOutlined,
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import type { HeaderProps, MenuItem } from '../../types'

const { Header: AntHeader } = Layout
const { Text } = Typography

const Header: React.FC<HeaderProps> = ({ collapsed, onToggle }) => {
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  // 使用状态来触发重新渲染
  const [avatarUrl, setAvatarUrl] = useState<string | null>(localStorage.getItem('avatar'))

  // 监听localStorage变化和自定义事件
  useEffect(() => {
    const handleAvatarUpdate = () => {
      setAvatarUrl(localStorage.getItem('avatar'))
    }

    // 监听自定义事件
    window.addEventListener('avatarUpdated', handleAvatarUpdate)

    return () => {
      window.removeEventListener('avatarUpdated', handleAvatarUpdate)
    }
  }, [])

  // 获取当前用户信息
  const username = localStorage.getItem('username') || '用户'

  // 处理登出
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('avatar')
    navigate('/login')
  }

  // 用户下拉菜单
  const userMenuItems: MenuItem[] = [
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider',
      key: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ]

  return (
    <AntHeader
      style={{
        padding: '0 24px',
        background: 'var(--ant-colorBgContainer)',
        borderBottom: '1px solid var(--ant.colorBorderSecondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* 左侧：折叠按钮和标题 */}
      <Space size={16}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          style={{ fontSize: '16px' }}
        />
        <Text strong style={{ fontSize: '18px' }}>
          个人知识库
        </Text>
      </Space>

      {/* 右侧：主题切换和用户菜单 */}
      <Space size={16}>
        {/* 主题切换按钮 */}
        <Button
          type="text"
          icon={isDark ? <SunOutlined /> : <MoonOutlined />}
          onClick={() => toggleTheme()}
          style={{ fontSize: '16px' }}
        />

        {/* 用户头像和下拉菜单 */}
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar
              size="small"
              src={avatarUrl}
              icon={<UserOutlined />}
              key={avatarUrl} // 添加key以强制刷新
            />
            <Text>{username}</Text>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  )
}

export default Header
