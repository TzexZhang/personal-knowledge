/**
 * 分类管理页面
 * 管理所有分类
 */
import { useState, useEffect } from 'react'
import { Card, Table, Button, Input, Modal, Form, Space, message, Popconfirm, Statistic, Row, Col } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, FolderOutlined } from '@ant-design/icons'
import { categoryAPI } from '../services/api'
import type { Category } from '../types'

const { TextArea } = Input

const CategoriesPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [form] = Form.useForm()

  // 加载分类列表
  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setLoading(true)
    try {
      const data = await categoryAPI.getCategories()
      setCategories(data)
    } catch (error) {
      console.error('加载分类失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 创建或更新分类
  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      if (editingCategory) {
        await categoryAPI.updateCategory(editingCategory.id, values)
        message.success('分类更新成功')
      } else {
        await categoryAPI.createCategory(values)
        message.success('分类创建成功')
      }
      setModalVisible(false)
      form.resetFields()
      setEditingCategory(null)
      loadCategories()
    } catch (error) {
      if (error.errorFields) {
        message.error('请填写必填项')
      } else {
        message.error(editingCategory ? '更新失败' : '创建失败')
      }
    }
  }

  // 删除分类
  const handleDelete = async (id: number) => {
    try {
      await categoryAPI.deleteCategory(id)
      message.success('分类删除成功')
      loadCategories()
    } catch (error) {
      message.error('删除失败')
    }
  }

  // 编辑分类
  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    form.setFieldsValue({
      name: category.name,
      description: category.description,
    })
    setModalVisible(true)
  }

  // 表格列定义
  const columns = [
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <FolderOutlined style={{ color: '#1890ff' }} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => text || '-',
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
      render: (_: any, record: Category) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个分类吗？"
            description="删除分类不会删除分类下的笔记"
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
              title="分类总数"
              value={categories.length}
              prefix={<FolderOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 分类列表 */}
      <Card
        title="分类管理"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingCategory(null)
              form.resetFields()
              setModalVisible(true)
            }}
          >
            新建分类
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* 创建/编辑分类对话框 */}
      <Modal
        title={editingCategory ? '编辑分类' : '新建分类'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
          setEditingCategory(null)
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="分类名称"
            name="name"
            rules={[
              { required: true, message: '请输入分类名称' },
              { max: 50, message: '分类名称最多50个字符' },
            ]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>

          <Form.Item
            label="描述"
            name="description"
            rules={[
              { max: 200, message: '描述最多200个字符' },
            ]}
          >
            <TextArea
              placeholder="请输入分类描述（可选）"
              rows={4}
              maxLength={200}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default CategoriesPage
