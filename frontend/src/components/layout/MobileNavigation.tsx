/**
 * 移动端底部导航栏组件
 * 在小屏幕上显示底部导航
 */
import { TabBar } from 'antd-mobile'
import { AppOutline, FolderOutline, TagOutline, UserOutline } from 'antd-mobile-icons'
import { useNavigate, useLocation } from 'react-router-dom'
import type { MenuItem } from '../../types'

const MobileNavigation: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // 底部导航项
  const tabs: MenuItem[] = [
    {
      key: '/dashboard',
      title: '首页',
      icon: <AppOutline />,
    },
    {
      key: '/notes',
      title: '笔记',
      icon: <FolderOutline />,
    },
    {
      key: '/tags',
      title: '标签',
      icon: <TagOutline />,
    },
    {
      key: '/profile',
      title: '我的',
      icon: <UserOutline />,
    },
  ]

  return (
    <TabBar
      activeKey={location.pathname}
      onChange={(key) => navigate(key as string)}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: 'var(--ant-colorBgContainer)',
        borderTop: '1px solid var(--ant-colorBorderSecondary)',
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
        // 适配 iPhone X 及以上机型的底部安全区域
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {tabs.map((item) => (
        <TabBar.Item key={item.key} title={item.title} icon={item.icon} />
      ))}
    </TabBar>
  )
}

export default MobileNavigation
