/**
 * 收藏夹页面
 * 显示所有收藏的笔记
 */
import { List, Card, Tag, Space, Button, Empty, Spin, Tooltip, Typography } from 'antd'
import { StarFilled, EyeOutlined, CalendarOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { noteAPI } from '../services/api'
import { useBreakpoint } from '../hooks/useBreakpoint'
import NoteDetailDrawer from '../components/NoteDetailDrawer'
import type { Note } from '../types'

const { Text, Paragraph } = Typography

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate()
  const isMobile = useBreakpoint()

  const [loading, setLoading] = useState<boolean>(false)
  const [notes, setNotes] = useState<Note[]>([])

  // 抽屉状态
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  // 加载收藏笔记
  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    setLoading(true)
    try {
      const data = await noteAPI.getNotes({ is_favorite: true, page: 1, page_size: 100 })
      setNotes(data.items)
    } catch (error) {
      console.error('加载收藏失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 切换收藏状态
  const toggleFavorite = async (noteId: number, currentStatus: boolean) => {
    try {
      await noteAPI.updateNote(noteId, { is_favorite: !currentStatus })
      loadFavorites()
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

  // 渲染笔记项
  const renderNoteItem = (item: Note) => {
    return (
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
              <Tooltip title="取消收藏">
                <Button
                  type="text"
                  icon={<StarFilled />}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(item.id, item.is_favorite)
                  }}
                  style={{
                    color: '#faad14',
                    fontSize: 16,
                  }}
                />
              </Tooltip>
            </Space>
          </div>
        </Card>
      </List.Item>
    )
  }

  return (
    <div style={{ padding: isMobile ? '12px' : '24px', maxWidth: 1400, margin: '0 auto' }}>
      <Card
        title={
          <Space>
            <StarFilled style={{ color: '#faad14' }} />
            <span>我的收藏</span>
          </Space>
        }
        extra={
          notes.length > 0 && (
            <Text type="secondary">共 {notes.length} 条收藏</Text>
          )
        }
        style={{
          marginBottom: 20,
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      />

      <Spin spinning={loading}>
        {notes.length > 0 ? (
          <List
            dataSource={notes}
            renderItem={renderNoteItem}
            style={{ background: 'transparent' }}
          />
        ) : (
          <Card
            style={{
              borderRadius: '12px',
              textAlign: 'center',
              padding: '60px 0',
            }}
          >
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div>
                  <Paragraph style={{ fontSize: 16, color: 'var(--ant-colorTextDescription)' }}>
                    暂无收藏
                  </Paragraph>
                  <Text type="secondary">去笔记列表添加一些吧</Text>
                </div>
              }
            />
          </Card>
        )}
      </Spin>

      {/* 笔记详情抽屉 */}
      <NoteDetailDrawer
        visible={drawerVisible}
        note={selectedNote}
        onClose={closeDrawer}
      />

      {/* 自定义样式 */}
      <style>{`
        .note-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.1) !important;
          transform: translateY(-2px);
          border-color: var(--ant-colorPrimary) !important;
        }
        .note-card .ant-card-body {
          padding: 20px !important;
        }
      `}</style>
    </div>
  )
}

export default FavoritesPage
