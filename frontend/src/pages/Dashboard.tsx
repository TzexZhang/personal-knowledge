/**
 * 仪表板页面组件
 */
import { Card, Row, Col, Statistic, Typography, List, Tag, Spin, Empty, Space, Button, Tooltip } from 'antd'
import { FileTextOutlined, TagsOutlined, EyeOutlined, StarFilled, StarOutlined, CalendarOutlined } from '@ant-design/icons'
import { useTheme } from '../contexts/ThemeContext'
import { useState, useEffect } from 'react'
import { noteAPI, categoryAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'
import NoteDetailDrawer from '../components/NoteDetailDrawer'
import type { Note, Category } from '../types'

const { Title, Text, Paragraph } = Typography

const Dashboard: React.FC = () => {
  const { isDark } = useTheme()
  const navigate = useNavigate()

  const [loading, setLoading] = useState<boolean>(true)
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalCategories: 0,
    totalViews: 0,
    totalFavorites: 0,
  })
  const [recentNotes, setRecentNotes] = useState<Note[]>([])

  // 抽屉状态
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // 获取统计数据
      const [notesData, categoriesData] = await Promise.all([
        noteAPI.getNotes({ page: 1, page_size: 100 }),
        categoryAPI.getCategories(),
      ])

      // 计算统计数据
      const totalNotes = notesData.total
      const totalCategories = categoriesData.length
      const totalViews = notesData.items.reduce((sum, note) => sum + note.view_count, 0)
      const totalFavorites = notesData.items.filter(note => note.is_favorite).length

      setStats({
        totalNotes,
        totalCategories,
        totalViews,
        totalFavorites,
      })

      // 获取最近编辑的笔记（前5条）
      setRecentNotes(notesData.items.slice(0, 5))
    } catch (error) {
      console.error('加载仪表板数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 切换收藏状态
  const toggleFavorite = async (noteId: number, currentStatus: boolean) => {
    try {
      await noteAPI.updateNote(noteId, { is_favorite: !currentStatus })
      loadDashboardData()
    } catch (error) {
      console.error('更新收藏状态失败:', error)
    }
  }

  // 打开笔记详情抽屉
  const openNoteDetail = async (noteId: number) => {
    try {
      const note = await noteAPI.getNoteDetail(noteId)
      setSelectedNote(note)
      setDrawerVisible(true)
    } catch (error) {
      console.error('加载笔记详情失败:', error)
    }
  }

  // 关闭抽屉
  const closeDrawer = () => {
    setDrawerVisible(false)
    setSelectedNote(null)
  }

  // 获取分类颜色
  const getCategoryColor = (categoryName: string) => {
    const colors = ['#108ee9', '#f50', '#2db7f5', '#87d068', '#722ed1', '#eb2f96', '#fa541c', '#faad14', '#13c2c2', '#52c41a']
    let hash = 0
    for (let i = 0; i < categoryName.length; i++) {
      hash = categoryName.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
  }

  if (loading) {
    return (
      <div style={{ padding: '12px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div style={{ padding: '12px', background: 'var(--ant-colorBgLayout)', minHeight: '100vh' }}>
      <Title level={2}>仪表板</Title>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总笔记数"
              value={stats.totalNotes}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="分类数"
              value={stats.totalCategories}
              prefix={<TagsOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总浏览量"
              value={stats.totalViews}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="收藏数"
              value={stats.totalFavorites}
              prefix={<StarFilled />}
              valueStyle={{ color: '#fa541c' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 最近笔记 */}
      <Card
        title="最近编辑"
        extra={<a onClick={() => navigate('/notes')}>查看全部</a>}
        style={{ borderRadius: '12px' }}
      >
        {recentNotes.length > 0 ? (
          <List
            dataSource={recentNotes}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                style={{
                  padding: 0,
                  marginBottom: 16,
                  border: 'none',
                  display: 'block',
                }}
              >
                <Card
                  hoverable
                  className="note-card"
                  style={{
                    borderRadius: '12px',
                    border: '1px solid var(--ant-colorBorderSecondary)',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden',
                  }}
                  styles={{ body: { padding: '20px' } }}
                  onClick={() => openNoteDetail(item.id)}
                >
                  {/* 卡片标题区域 */}
                  <div style={{ marginBottom: 12 }}>
                    <Space size={8} wrap>
                      <Text
                        strong
                        style={{
                          fontSize: 18,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          openNoteDetail(item.id)
                        }}
                      >
                        {item.title}
                      </Text>
                      {item.category && (
                        <Tag
                          color={getCategoryColor(item.category.name)}
                          style={{ borderRadius: '4px' }}
                        >
                          {item.category.name}
                        </Tag>
                      )}
                      {item.tags?.slice(0, 3).map((tag) => (
                        <Tag key={tag.id} style={{ borderRadius: '4px' }}>
                          {tag.name}
                        </Tag>
                      ))}
                      {item.tags && item.tags.length > 3 && (
                        <Tag style={{ borderRadius: '4px' }}>
                          +{item.tags.length - 3}
                        </Tag>
                      )}
                    </Space>
                  </div>

                  {/* 卡片内容预览 */}
                  <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={{
                      color: 'var(--ant-colorTextSecondary)',
                      fontSize: 14,
                      lineHeight: 1.8,
                      marginBottom: 12,
                    }}
                  >
                    {item.summary || (item.content ? item.content.replace(/<[^>]*>/g, '').substring(0, 200) : '暂无内容')}
                  </Paragraph>

                  {/* 卡片底部信息 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space size={16} split={<span style={{ color: 'var(--ant-colorBorder)' }}>|</span>}>
                      <Space size={4} style={{ color: 'var(--ant-colorTextDescription)', fontSize: 13 }}>
                        <EyeOutlined style={{ fontSize: 12 }} />
                        <span>{item.view_count} 浏览</span>
                      </Space>
                      <Space size={4} style={{ color: 'var(--ant-colorTextDescription)', fontSize: 13 }}>
                        <CalendarOutlined style={{ fontSize: 12 }} />
                        <span>{new Date(item.updated_at).toLocaleDateString('zh-CN')}</span>
                      </Space>
                    </Space>

                    {/* 操作按钮 */}
                    <Space size={8}>
                      <Tooltip title={item.is_favorite ? '取消收藏' : '收藏'}>
                        <Button
                          type="text"
                          icon={item.is_favorite ? <StarFilled /> : <StarOutlined />}
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(item.id, item.is_favorite)
                          }}
                          style={{
                            color: item.is_favorite ? '#faad14' : 'var(--ant-colorTextSecondary)',
                            fontSize: 16,
                          }}
                        />
                      </Tooltip>
                    </Space>
                  </div>
                </Card>
              </List.Item>
            )}
            style={{ background: 'transparent' }}
          />
        ) : (
          <Empty description="暂无笔记，开始创建你的第一条笔记吧" />
        )}
      </Card>

      {/* 笔记详情抽屉 */}
      <NoteDetailDrawer
        visible={drawerVisible}
        note={selectedNote}
        onClose={closeDrawer}
      />

      <style>{`
        .note-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.1) !important;
          transform: translateY(-2px);
          border-color: var(--ant-colorPrimary) !important;
        }
      `}</style>
    </div>
  )
}

export default Dashboard
