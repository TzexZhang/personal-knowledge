/**
 * 笔记列表页面组件
 * 显示所有笔记，支持分页、搜索和筛选
 */
import { List, Card, Input, Select, Tag, Space, Button, Empty, Spin, Tooltip, Typography } from 'antd'
import { SearchOutlined, PlusOutlined, StarOutlined, StarFilled, EditOutlined, EyeOutlined, CalendarOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { noteAPI, categoryAPI, tagAPI } from '../services/api'
import { useBreakpoint } from '../hooks/useBreakpoint'
import NoteDetailDrawer from '../components/NoteDetailDrawer'
import type { Note, Category, NoteListParams, Tag as TagType } from '../types'

const { Search } = Input
const { Option } = Select
const { Text, Paragraph } = Typography

const NoteListPage: React.FC = () => {
  const navigate = useNavigate()
  const isMobile = useBreakpoint()

  const [loading, setLoading] = useState<boolean>(false)
  const [notes, setNotes] = useState<Note[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [allTags, setAllTags] = useState<TagType[]>([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  // 抽屉状态
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  // 筛选条件
  const [filters, setFilters] = useState<Partial<NoteListParams>>({
    keyword: '',
    category_id: null,
    tag_id: null,
    is_favorite: null,
  })

  // 加载笔记列表
  useEffect(() => {
    loadNotes()
  }, [pagination.current, filters])

  const loadNotes = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.current,
        page_size: pagination.pageSize,
        ...filters,
      }
      const data = await noteAPI.getNotes(params)
      setNotes(data.items)
      setPagination((prev) => ({
        ...prev,
        total: data.total,
      }))
    } catch (error) {
      console.error('加载笔记失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 加载分类列表
  useEffect(() => {
    loadCategories()
    loadTags()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await categoryAPI.getCategories()
      setCategories(data)
    } catch (error) {
      console.error('加载分类失败:', error)
    }
  }

  const loadTags = async () => {
    try {
      const data = await tagAPI.getTags()
      setAllTags(data)
    } catch (error) {
      console.error('加载标签失败:', error)
    }
  }

  // 搜索处理
  const handleSearch = (value: string) => {
    setFilters({ ...filters, keyword: value })
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  // 分类筛选
  const handleCategoryChange = (value: number | null) => {
    setFilters({ ...filters, category_id: value ?? undefined })
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  // 收藏筛选
  const handleFavoriteChange = (value: boolean | null) => {
    setFilters({ ...filters, is_favorite: value ?? undefined })
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  // 标签筛选
  const handleTagChange = (value: number | null) => {
    setFilters({ ...filters, tag_id: value ?? undefined })
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  // 切换收藏状态
  const toggleFavorite = async (noteId: number, currentStatus: boolean) => {
    try {
      await noteAPI.updateNote(noteId, { is_favorite: !currentStatus })
      loadNotes()
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
              <Tooltip title="编辑">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/notes/${item.id}`)
                  }}
                  style={{
                    color: 'var(--ant-colorTextSecondary)',
                    fontSize: 16,
                  }}
                />
              </Tooltip>
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
    )
  }

  return (
    <div style={{ padding: isMobile ? '12px' : '24px', maxWidth: 1400, margin: '0 auto' }}>
      {/* 顶部搜索栏 */}
      <Card
        style={{
          marginBottom: 20,
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Search
            placeholder="搜索笔记标题或内容..."
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ width: '100%' }}
            size="large"
          />
          <Space wrap>
            <Select
              placeholder="选择分类"
              allowClear
              style={{ width: 150 }}
              onChange={handleCategoryChange}
            >
              {categories.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="选择标签"
              allowClear
              style={{ width: 150 }}
              onChange={handleTagChange}
            >
              {allTags.map((tag) => (
                <Option key={tag.id} value={tag.id}>
                  {tag.name}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="收藏状态"
              allowClear
              style={{ width: 120 }}
              onChange={handleFavoriteChange}
            >
              <Option value={true}>已收藏</Option>
              <Option value={false}>未收藏</Option>
            </Select>
          </Space>
        </Space>
      </Card>

      {/* 新建笔记按钮 */}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => navigate('/notes/new')}
        style={{
          marginBottom: 20,
          height: 44,
          fontSize: 16,
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
        }}
        size="large"
        block={isMobile}
      >
        新建笔记
      </Button>

      {/* 笔记列表 */}
      <Spin spinning={loading}>
        {notes.length > 0 ? (
          <>
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">
                共 {pagination.total} 条笔记
              </Text>
            </div>
            <List
              dataSource={notes}
              renderItem={renderNoteItem}
              style={{ background: 'transparent' }}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                onChange: (page) => setPagination((prev) => ({ ...prev, current: page })),
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `显示 ${range[0]}-${range[1]} 条，共 ${total} 条`,
                pageSizeOptions: ['10', '20', '50'],
                style: {
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '24px',
                },
              }}
            />
          </>
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
                    暂无笔记
                  </Paragraph>
                  <Text type="secondary">点击上方按钮创建你的第一条笔记吧</Text>
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

export default NoteListPage
