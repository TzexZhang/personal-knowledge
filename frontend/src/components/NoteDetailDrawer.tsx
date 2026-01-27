/**
 * 笔记详情抽屉组件
 * 以只读方式展示笔记完整内容
 */
import { Drawer, Tag, Space, Typography, Divider, Empty, Spin } from 'antd'
import {
  CalendarOutlined,
  EyeOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons'
import type { Note } from '../types'

const { Title, Text, Paragraph } = Typography

interface NoteDetailDrawerProps {
  visible: boolean
  note: Note | null
  onClose: () => void
}

const NoteDetailDrawer: React.FC<NoteDetailDrawerProps> = ({ visible, note, onClose }) => {
  if (!note) return null

  // 获取分类颜色
  const getCategoryColor = (categoryName: string) => {
    const colors = ['#108ee9', '#f50', '#2db7f5', '#87d068', '#722ed1', '#eb2f96', '#fa541c', '#faad14', '#13c2c2', '#52c41a']
    let hash = 0
    for (let i = 0; i < categoryName.length; i++) {
      hash = categoryName.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
  }

  return (
    <Drawer
      title={null}
      placement="right"
      width={720}
      open={visible}
      onClose={onClose}
      styles={{
        body: { padding: 0 },
      }}
    >
      <div style={{ padding: '24px' }}>
        {/* 标题 */}
        <Title level={3} style={{ marginBottom: 16 }}>
          {note.title}
        </Title>

        {/* 元信息 */}
        <Space size={16} wrap style={{ marginBottom: 16 }}>
          {note.category && (
            <Tag color={getCategoryColor(note.category.name)} style={{ borderRadius: '4px' }}>
              {note.category.name}
            </Tag>
          )}
          {note.tags?.map((tag) => (
            <Tag key={tag.id} style={{ borderRadius: '4px' }}>
              {tag.name}
            </Tag>
          ))}
          {note.is_favorite && (
            <Tag icon={<StarFilled />} color="warning" style={{ borderRadius: '4px' }}>
              已收藏
            </Tag>
          )}
        </Space>

        <Divider />

        {/* 统计信息 */}
        <Space size={16} style={{ marginBottom: 24 }}>
          <Space size={4}>
            <EyeOutlined style={{ fontSize: 12 }} />
            <Text type="secondary" style={{ fontSize: 13 }}>
              {note.view_count} 浏览
            </Text>
          </Space>
          <Space size={4}>
            <CalendarOutlined style={{ fontSize: 12 }} />
            <Text type="secondary" style={{ fontSize: 13 }}>
              创建于 {new Date(note.created_at).toLocaleString('zh-CN')}
            </Text>
          </Space>
          <Space size={4}>
            <CalendarOutlined style={{ fontSize: 12 }} />
            <Text type="secondary" style={{ fontSize: 13 }}>
              更新于 {new Date(note.updated_at).toLocaleString('zh-CN')}
            </Text>
          </Space>
        </Space>

        <Divider />

        {/* 笔记内容 */}
        <div>
          <Text strong style={{ fontSize: 14, marginBottom: 12, display: 'block' }}>
            笔记内容
          </Text>
          <div
            dangerouslySetInnerHTML={{ __html: note.content }}
            style={{
              minHeight: 300,
              padding: 16,
              backgroundColor: 'var(--ant.colorBgContainer)',
              borderRadius: 8,
              border: '1px solid var(--ant.colorBorder)',
              lineHeight: 1.8,
            }}
          />
        </div>
      </div>
    </Drawer>
  )
}

export default NoteDetailDrawer
