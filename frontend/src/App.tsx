/**
 * 应用主组件
 * 路由配置和全局布局
 */
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider, Layout, App as AntdApp } from 'antd'
import { useState } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import IndexPage from './pages/IndexPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import NoteListPage from './pages/NoteListPage'
import NoteDetailPage from './pages/NoteDetailPage'
import Settings from './pages/Settings'
import FavoritesPage from './pages/FavoritesPage'
import TagsPage from './pages/TagsPage'
import CategoriesPage from './pages/CategoriesPage'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import MobileNavigation from './components/layout/MobileNavigation'
import { useBreakpoint } from './hooks/useBreakpoint'
import type { ProtectedRouteProps, MainLayoutProps } from './types'

const { Content } = Layout

// 受保护的路由组件包装器
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token')
  console.log('[ProtectedRoute] Checking token:', token ? 'Token exists' : 'No token')
  if (token) {
    console.log('[ProtectedRoute] Token length:', token.length)
  }
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

// 主布局组件
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false)
  const isMobile = useBreakpoint()

  // 移动端不显示侧边栏，使用底部导航
  if (isMobile) {
    return (
      <Layout style={{ minHeight: '100vh', paddingBottom: '60px', position: 'relative' }}>
        <Header collapsed={false} onToggle={() => {}} />
        <Content style={{
          padding: '12px',
          background: 'var(--ant.colorBgLayout)',
          overflow: 'auto',
          position: 'relative',
          zIndex: 1
        }}>
          {children}
        </Content>
        <MobileNavigation />
      </Layout>
    )
  }

  // 桌面端显示侧边栏
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} />
      <Layout style={{ marginLeft: collapsed ? 0 : 200, transition: 'margin-left 0.2s' }}>
        <Header collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        <Content style={{ padding: '24px', background: 'var(--ant.colorBgLayout)' }}>{children}</Content>
      </Layout>
    </Layout>
  )
}

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AntdApp>
        <Router>
          <Routes>
            {/* 公开路由 */}
            <Route path="/" element={<IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* 受保护的路由 */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <NoteListPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes/new"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <NoteDetailPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes/:id"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <NoteDetailPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <FavoritesPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tags"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <TagsPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/categories"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <CategoriesPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Settings />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Settings />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* 404 重定向 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AntdApp>
    </ThemeProvider>
  )
}

export default App
