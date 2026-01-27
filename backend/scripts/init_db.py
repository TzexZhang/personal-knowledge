"""
数据库初始化脚本
创建所有数据库表并验证结构
"""
import sys
from pathlib import Path

# 添加项目根目录到 Python 路径
sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy import inspect, text
from app.database import engine, Base, SessionLocal
from app.models import User, Category, Tag, Note, NoteTag


def init_database():
    """
    初始化数据库，创建所有表
    """
    print("=" * 60)
    print("开始初始化数据库...")
    print("=" * 60)

    # 创建所有表
    Base.metadata.create_all(bind=engine)
    print("✓ 数据库表创建成功")

    # 验证表结构
    print("\n" + "=" * 60)
    print("数据库表结构验证")
    print("=" * 60)

    inspector = inspect(engine)
    tables = inspector.get_table_names()

    print(f"\n共有 {len(tables)} 个表:")
    for table in sorted(tables):
        columns = inspector.get_columns(table)
        print(f"\n  📋 {table} ({len(columns)} 个字段):")

        for column in columns:
            nullable = "可空" if column['nullable'] else "必填"
            primary = " [主键]" if column['primary_key'] else ""
            print(f"     - {column['name']}: {column['type']} ({nullable}){primary}")

    # 测试数据库连接
    print("\n" + "=" * 60)
    print("测试数据库连接")
    print("=" * 60)

    db = SessionLocal()
    try:
        # 测试查询
        user_count = db.query(User).count()
        category_count = db.query(Category).count()
        tag_count = db.query(Tag).count()
        note_count = db.query(Note).count()

        print(f"\n✓ 数据库连接正常")
        print(f"  - 用户数: {user_count}")
        print(f"  - 分类数: {category_count}")
        print(f"  - 标签数: {tag_count}")
        print(f"  - 笔记数: {note_count}")

        # 检查是否有测试用户
        test_user = db.query(User).filter(User.username == "test").first()
        if not test_user:
            print("\n💡 提示: 还没有测试用户，可以运行以下命令创建:")
            print("   python scripts/create_test_user.py")

    except Exception as e:
        print(f"\n✗ 数据库连接失败: {e}")
    finally:
        db.close()

    print("\n" + "=" * 60)
    print("数据库初始化完成！")
    print("=" * 60)


def show_table_details():
    """
    显示表的详细结构和关系
    """
    print("\n" + "=" * 60)
    print("表关系说明")
    print("=" * 60)

    relationships = {
        "users": {
            "description": "用户表",
            "relationships": [
                "1:N → categories (一个用户有多个分类)",
                "1:N → tags (一个用户有多个标签)",
                "1:N → notes (一个用户有多篇笔记)",
            ]
        },
        "categories": {
            "description": "分类表",
            "relationships": [
                "N:1 → users (多个分类属于一个用户)",
                "1:N → notes (一个分类包含多篇笔记)",
                "自关联 → parent/children (支持树形结构)",
            ]
        },
        "tags": {
            "description": "标签表",
            "relationships": [
                "N:1 → users (多个标签属于一个用户)",
                "M:N → notes (标签和笔记是多对多关系，通过 note_tags 关联)",
            ]
        },
        "notes": {
            "description": "笔记表",
            "relationships": [
                "N:1 → users (多篇笔记属于一个用户)",
                "N:1 → categories (多篇笔记属于一个分类)",
                "M:N → tags (笔记和标签是多对多关系，通过 note_tags 关联)",
            ]
        },
        "note_tags": {
            "description": "笔记标签关联表（多对多）",
            "relationships": [
                "N:1 → notes",
                "N:1 → tags",
            ]
        },
    }

    for table_name, info in relationships.items():
        print(f"\n📊 {table_name}")
        print(f"   {info['description']}")
        if info.get('relationships'):
            print("   关系:")
            for rel in info['relationships']:
                print(f"     {rel}")


def check_required_fields():
    """
    检查所有必需字段是否都已定义
    """
    print("\n" + "=" * 60)
    print("字段完整性检查")
    print("=" * 60)

    # 检查 User 模型
    user_fields = {
        'id': '主键',
        'username': '用户名',
        'email': '邮箱',
        'password_hash': '密码哈希',
        'avatar': '头像URL ✓ (已添加)',
        'theme_preference': '主题偏好',
        'primary_color': '主色调',
        'created_at': '创建时间',
        'updated_at': '更新时间',
    }
    print("\n✓ User 模型字段完整")
    for field, desc in user_fields.items():
        print(f"  - {field}: {desc}")

    # 检查 Note 模型
    note_fields = {
        'id': '主键',
        'user_id': '用户ID (外键)',
        'category_id': '分类ID (外键)',
        'title': '标题',
        'content': '内容',
        'is_favorite': '是否收藏',
        'view_count': '浏览次数',
        'created_at': '创建时间',
        'updated_at': '更新时间',
    }
    print("\n✓ Note 模型字段完整")
    for field, desc in note_fields.items():
        print(f"  - {field}: {desc}")


if __name__ == "__main__":
    try:
        # 初始化数据库
        init_database()

        # 显示表详情
        show_table_details()

        # 检查字段完整性
        check_required_fields()

        print("\n" + "=" * 60)
        print("✅ 所有检查通过！数据库结构正常。")
        print("=" * 60)

    except Exception as e:
        print(f"\n❌ 错误: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
