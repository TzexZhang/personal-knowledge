/**
 * 笔记详情页面组件
 * 查看和编辑笔记
 */
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Space,
  message,
  Spin,
  Tag,
  Modal,
} from "antd";
import {
  SaveOutlined,
  ArrowLeftOutlined,
  StarOutlined,
  StarFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { noteAPI, categoryAPI, tagAPI } from "../services/api";
import type { Note, Category, Tag as TagType, NoteFormValues } from "../types";
import WangEditor from "../components/WangEditor";

const { TextArea } = Input;
const { Option } = Select;

const NoteDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  // 更健壮的检查：使用 location.pathname 而不是 id 参数
  const isNew = location.pathname === '/notes/new' || id === 'new';

  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<TagType[]>([]);
  const [note, setNote] = useState<Note | null>(null);

  // 分类弹窗状态
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [categoryForm] = Form.useForm();

  // 标签弹窗状态
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [tagForm] = Form.useForm();

  // 加载笔记详情
  useEffect(() => {
    if (!isNew) {
      loadNoteDetail();
    }
    loadCategories();
    loadTags();
  }, [id, isNew]);

  const loadNoteDetail = async () => {
    setLoading(true);
    try {
      const noteData = await noteAPI.getNoteDetail(id!);
      setNote(noteData);
      form.setFieldsValue({
        title: noteData.title,
        content: noteData.content,
        category_id: noteData.category_id,
        tag_ids: noteData.tags?.map((tag) => tag.id) || [],
      });
    } catch (error) {
      message.error("加载笔记失败");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoryAPI.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("加载分类失败:", error);
    }
  };

  const loadTags = async () => {
    try {
      const data = await tagAPI.getTags();
      setAllTags(data);
    } catch (error) {
      console.error("加载标签失败:", error);
    }
  };

  // 保存笔记
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log('表单提交的值:', values);
      setSaving(true);
      if (isNew) {
        await noteAPI.createNote(values);
        message.success("创建成功");
      } else {
        await noteAPI.updateNote(id!, values);
        message.success("保存成功");
      }

      navigate("/notes");
    } catch (error: any) {
      if (error.errorFields) {
        message.error("请填写必填项");
      } else {
        message.error(isNew ? "创建失败" : "保存失败");
        console.error(error);
      }
    } finally {
      setSaving(false);
    }
  };

  // 切换收藏状态
  const toggleFavorite = async () => {
    if (!note) return;
    try {
      const newStatus = !note.is_favorite;
      await noteAPI.updateNote(id!, { is_favorite: newStatus });
      setNote({ ...note, is_favorite: newStatus });
      message.success(newStatus ? "已收藏" : "已取消收藏");
    } catch (error) {
      message.error("操作失败");
      console.error(error);
    }
  };

  // 添加新分类
  const handleAddCategory = async () => {
    try {
      const values = await categoryForm.validateFields();
      await categoryAPI.createCategory(values);
      message.success("分类创建成功");
      setCategoryModalVisible(false);
      categoryForm.resetFields();
      loadCategories(); // 重新加载分类列表
    } catch (error: any) {
      if (error.errorFields) {
        message.error("请填写分类名称");
      } else {
        message.error("创建失败");
        console.error(error);
      }
    }
  };

  // 添加新标签
  const handleAddTag = async () => {
    try {
      const values = await tagForm.validateFields();
      await tagAPI.createTag(values);
      message.success("标签创建成功");
      setTagModalVisible(false);
      tagForm.resetFields();
      loadTags(); // 重新加载标签列表
    } catch (error: any) {
      if (error.errorFields) {
        message.error("请填写标签名称");
      } else {
        message.error("创建失败");
        console.error(error);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={isNew ? "新建笔记" : "编辑笔记"}
        extra={
          <Space>
            {!isNew && (
              <Button
                type="text"
                icon={note?.is_favorite ? <StarFilled /> : <StarOutlined />}
                onClick={toggleFavorite}
              >
                {note?.is_favorite ? "已收藏" : "收藏"}
              </Button>
            )}
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/notes")}
            >
              返回
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              loading={saving}
            >
              保存
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            is_favorite: false,
          }}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "请输入笔记标题" }]}
          >
            <Input placeholder="输入笔记标题" size="large" />
          </Form.Item>

          <Form.Item label="分类" name="category_id">
            <Space.Compact style={{ width: '100%' }}>
              <Select placeholder="选择分类（可选）" allowClear style={{ flex: 1 }}>
                {categories.map((cat) => (
                  <Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </Option>
                ))}
              </Select>
              <Button
                icon={<PlusOutlined />}
                onClick={() => setCategoryModalVisible(true)}
              >
                新建
              </Button>
            </Space.Compact>
          </Form.Item>

          <Form.Item label="标签" name="tag_ids">
            <Space.Compact style={{ width: '100%' }}>
              <Select
                mode="multiple"
                placeholder="选择标签（可多选）"
                allowClear
                style={{ flex: 1 }}
                tagRender={(props) => {
                  const { label, closable, onClose } = props;
                  return (
                    <Tag
                      closable={closable}
                      onClose={onClose}
                      style={{ marginRight: 3 }}
                    >
                      {label}
                    </Tag>
                  );
                }}
              >
                {allTags.map((tag) => (
                  <Option key={tag.id} value={tag.id}>
                    {tag.name}
                  </Option>
                ))}
              </Select>
              <Button
                icon={<PlusOutlined />}
                onClick={() => setTagModalVisible(true)}
              >
                新建
              </Button>
            </Space.Compact>
          </Form.Item>

          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: "请输入笔记内容" }]}
          >
            <WangEditor
              key={isNew ? 'new' : id}
              placeholder="在这里输入笔记内容，支持富文本格式..."
            />
          </Form.Item>
        </Form>
      </Card>

      {/* 新建分类弹窗 */}
      <Modal
        title="新建分类"
        open={categoryModalVisible}
        onOk={handleAddCategory}
        onCancel={() => {
          setCategoryModalVisible(false);
          categoryForm.resetFields();
        }}
      >
        <Form form={categoryForm} layout="vertical">
          <Form.Item
            label="分类名称"
            name="name"
            rules={[{ required: true, message: "请输入分类名称" }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea rows={4} placeholder="请输入分类描述（可选）" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 新建标签弹窗 */}
      <Modal
        title="新建标签"
        open={tagModalVisible}
        onOk={handleAddTag}
        onCancel={() => {
          setTagModalVisible(false);
          tagForm.resetFields();
        }}
      >
        <Form form={tagForm} layout="vertical">
          <Form.Item
            label="标签名称"
            name="name"
            rules={[{ required: true, message: "请输入标签名称" }]}
          >
            <Input placeholder="请输入标签名称" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NoteDetailPage;
