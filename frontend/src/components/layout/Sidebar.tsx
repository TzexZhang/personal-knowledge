/**
 * 侧边栏导航组件
 * 包含分类列表和主要导航链接
 */
import { Layout, Menu } from 'antd'
import {
  DashboardOutlined,
  TagsOutlined,
  StarOutlined,
  SettingOutlined,
  FolderOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { categoryAPI } from '../../services/api'
import type { SidebarProps, MenuItem, Category } from '../../types'

const { Sider } = Layout

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [categories, setCategories] = useState<Category[]>([])

  // 加载分类列表
  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await categoryAPI.getCategories()
      setCategories(data)
    } catch (error) {
      console.error('加载分类失败:', error)
    }
  }

  // 主要菜单项
  const mainMenuItems: MenuItem[] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表板',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: '/notes',
      icon: <DashboardOutlined />,
      label: '所有笔记',
      onClick: () => navigate('/notes'),
    },
    {
      key: '/favorites',
      icon: <StarOutlined />,
      label: '收藏夹',
      onClick: () => navigate('/favorites'),
    },
    {
      key: '/categories',
      icon: <FolderOutlined />,
      label: '分类管理',
      onClick: () => navigate('/categories'),
    },
    {
      key: '/tags',
      icon: <TagsOutlined />,
      label: '标签管理',
      onClick: () => navigate('/tags'),
    },
  ]

  // 转换分类为菜单项
  const categoryMenuItems: MenuItem[] = categories.map((cat) => ({
    key: `/category/${cat.id}`,
    icon: <FolderOutlined />,
    label: cat.name,
    onClick: () => navigate(`/category/${cat.id}`),
  }))

  // 设置菜单项
  const settingsMenuItems: MenuItem[] = [
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '设置',
      onClick: () => navigate('/settings'),
    },
  ]

  // 获取当前选中的菜单项
  const getSelectedKey = (): string => {
    const path = location.pathname
    // 处理新增笔记页面
    if (path === '/notes/new') return '/notes'
    // 处理笔记详情页面
    if (path.startsWith('/notes/') && path !== '/notes/new') return '/notes'
    // 检查是否匹配分类路径
    const categoryMatch = categories.find((cat) => path === `/category/${cat.id}`)
    if (categoryMatch) return `/category/${categoryMatch.id}`
    // 检查是否匹配主菜单
    const mainMatch = mainMenuItems.find((item) => item.key === path)
    if (mainMatch) return path
    // 检查设置
    if (path === '/settings') return '/settings'
    // 默认返回仪表板
    return '/dashboard'
  }

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
      breakpoint="lg"
      collapsedWidth={0}
    >
      <div
        style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
        }}
      >
        {!collapsed && <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '18px' }}>知识库</span>}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        items={mainMenuItems}
        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}
      />

      <Menu theme="dark" mode="inline" selectedKeys={[getSelectedKey()]} items={settingsMenuItems} />
    </Sider>
  )
}

export default Sidebar
