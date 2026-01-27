/**
 * WangEditor 富文本编辑器组件
 */
import { useState, useEffect } from "react";
import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor";

interface WangEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  height?: string;
}

const WangEditor: React.FC<WangEditorProps> = ({
  value = "",
  onChange,
  placeholder = "请输入内容...",
  height = "500px",
}) => {
  const [html, setHtml] = useState(value || "");
  const [editor, setEditor] = useState<IDomEditor | null>(null);

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {
    excludeKeys: ["group-video"],
  };

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder,
    MENU_CONF: {
      uploadImage: {
        fieldName: "file",
        server: "/api/upload", // 需要配置后端上传接口
        allowedFileTypes: ["image/*"],
        maxFileSize: 5 * 1024 * 1024, // 5M
      },
    },
  };

  // 当外部value变化时，同步到编辑器
  useEffect(() => {
    if (editor && value !== undefined && value !== html) {
      editor.setHtml(value);
      setHtml(value);
    }
  }, [value, editor]);

  // 组件卸载时销毁编辑器
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
        setEditor(null);
      }
    };
  }, [editor]);

  // 编辑器内容变化时，同步到外部
  const handleChange = (editor: IDomEditor) => {
    const newHtml = editor.getHtml();
    setHtml(newHtml);
    onChange?.(newHtml);
  };

  // 编辑器创建完成
  const handleCreated = (editor: IDomEditor) => {
    setEditor(editor);
    if (value) {
      editor.setHtml(value);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", zIndex: 100 }}>
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        style={{ borderBottom: "1px solid #ccc" }}
      />
      <Editor
        defaultConfig={editorConfig}
        value={html}
        onCreated={handleCreated}
        onChange={handleChange}
        style={{ height, overflowY: "hidden" }}
      />
    </div>
  );
};

export default WangEditor;
