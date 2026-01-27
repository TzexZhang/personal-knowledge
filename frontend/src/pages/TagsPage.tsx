/**
 * 标签管理页面
 * 管理所有标签，查看标签下的笔记
 */
import { useState, useEffect } from 'react'
import { Card, Table, Button, Input, Modal, Form, Space, message, Popconfirm, Tag, Statistic, Row, Col } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, TagsOutlined } from '@ant-design/icons'
import { tagAPI, noteAPI } from '../services/api'
import type { Tag as TagType, Note } from '../types'

const TagsPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [tags, setTags] = useState<TagType[]>([])
  const [notes, setNotes] = useState<Record<number, Note[]>>({})
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [editingTag, setEditingTag] = useState<TagType | null>(null)
  const [form] = Form.useForm()

  // 加载标签列表
  useEffect(() => {
    loadTags()
  }, [])

  const loadTags = async () => {
    setLoading(true)
    try {
      const data = await tagAPI.getTags()
      setTags(data)
    } catch (error) {
      console.error('加载标签失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 加载标签下的笔记
  const loadTagNotes = async (tagId: number) => {
    if (notes[tagId]) return // 已加载

    try {
      const data = await noteAPI.getNotes({ tag_id: tagId, page: 1, page_size: 100 })
      setNotes((prev) => ({ ...prev, [tagId]: data.items }))
    } catch (error) {
      console.error('加载笔记失败:', error)
    }
  }

  // 创建或更新标签
  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      if (editingTag) {
        await tagAPI.updateTag(editingTag.id, values)
        message.success('标签更新成功')
      } else {
        await tagAPI.createTag(values)
        message.success('标签创建成功')
      }
      setModalVisible(false)
      form.resetFields()
      setEditingTag(null)
      loadTags()
    } catch (error) {
      if (error.errorFields) {
        message.error('请填写标签名称')
      } else {
        message.error(editingTag ? '更新失败' : '创建失败')
      }
    }
  }

  // 删除标签
  const handleDelete = async (id: number) => {
    try {
      await tagAPI.deleteTag(id)
      message.success('标签删除成功')
      loadTags()
    } catch (error) {
      message.error('删除失败')
    }
  }

  // 编辑标签
  const handleEdit = (tag: TagType) => {
    setEditingTag(tag)
    form.setFieldsValue({ name: tag.name })
    setModalVisible(true)
  }

  // 表格列定义
  const columns = [
    {
      title: '标签名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: TagType) => (
        <Tag color={record.color || 'blue'} style={{ fontSize: 14, padding: '4px 12px' }}>
          {text}
        </Tag>
      ),
    },
    {
      title: '笔记数量',
      dataIndex: 'id',
      key: 'noteCount',
      render: (_: any, record: TagType) => {
        const tagNotes = notes[record.id]
        return tagNotes ? tagNotes.length : '-'
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: TagType) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个标签吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: '24px' }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="标签总数"
              value={tags.length}
              prefix={<TagsOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 标签列表 */}
      <Card
        title="标签管理"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingTag(null)
              form.resetFields()
              setModalVisible(true)
            }}
          >
            新建标签
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={tags}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
          onRow={(record) => ({
            onMouseEnter: () => loadTagNotes(record.id),
          })}
        />
      </Card>

      {/* 创建/编辑标签对话框 */}
      <Modal
        title={editingTag ? '编辑标签' : '新建标签'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
          setEditingTag(null)
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="标签名称"
            name="name"
            rules={[{ required: true, message: '请输入标签名称' }]}
          >
            <Input placeholder="请输入标签名称" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default TagsPage
