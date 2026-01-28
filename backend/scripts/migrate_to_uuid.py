"""
数据库迁移脚本：将 Integer ID 迁移到 UUID String

⚠️  警告：此脚本会修改数据库结构，建议先备份数据库

执行方式：
python scripts/migrate_to_uuid.py
"""
import sys
from pathlib import Path

# 添加项目根目录到 Python 路径
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import create_engine, text, inspect
from app.config import settings
import logging
import uuid

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def generate_uuid():
    """生成 UUID 字符串"""
    return str(uuid.uuid4())


def migrate_users_table(engine):
    """迁移 users 表：integer id -> uuid string"""
    logger.info("开始迁移 users 表...")

    with engine.connect() as conn:
        # 1. 添加新列
        inspector = inspect(engine)
        columns = [col['name'] for col in inspector.get_columns('users')]

        if 'new_id' not in columns:
            logger.info("添加 new_id 列...")
            conn.execute(text(
                "ALTER TABLE users ADD COLUMN new_id VARCHAR(36) NULL COMMENT '新的UUID ID'"
            ))
            conn.commit()

        # 2. 为每条记录生成 UUID
        logger.info("为所有用户生成 UUID...")
        result = conn.execute(text("SELECT id FROM users"))
        users = result.fetchall()

        for user in users:
            old_id = user[0]
            new_uuid = generate_uuid()
            conn.execute(
                text("UPDATE users SET new_id = :new_id WHERE id = :old_id"),
                {"new_id": new_uuid, "old_id": old_id}
            )
        conn.commit()

        # 3. 迁移外键 - categories
        if 'categories' in inspector.get_table_names():
            logger.info("更新 categories.user_id...")
            conn.execute(text(
                "UPDATE categories c JOIN users u ON c.user_id = u.id "
                "SET c.new_user_id = u.new_id"
            ))

        # 4. 迁移外键 - tags
        if 'tags' in inspector.get_table_names():
            logger.info("更新 tags.user_id...")
            conn.execute(text(
                "UPDATE tags t JOIN users u ON t.user_id = u.id "
                "SET t.new_user_id = u.new_id"
            ))

        # 5. 迁移外键 - notes
        if 'notes' in inspector.get_table_names():
            logger.info("更新 notes.user_id...")
            conn.execute(text(
                "UPDATE notes n JOIN users u ON n.user_id = u.id "
                "SET n.new_user_id = u.new_id"
            ))

        conn.commit()

        # 6. 删除旧主键，设置新主键（这个需要重建表）
        logger.info("users 表准备完成，需要手动重建表或使用其他工具")


def migrate_categories_table(engine):
    """迁移 categories 表"""
    logger.info("开始迁移 categories 表...")

    with engine.connect() as conn:
        inspector = inspect(engine)
        columns = [col['name'] for col in inspector.get_columns('categories')]

        if 'new_id' not in columns:
            logger.info("添加 new_id 列...")
            conn.execute(text(
                "ALTER TABLE categories ADD COLUMN new_id VARCHAR(36) NULL COMMENT '新的UUID ID'"
            ))
            conn.commit()

        # 检查是否有 new_user_id 列，没有则添加
        if 'new_user_id' not in columns:
            conn.execute(text(
                "ALTER TABLE categories ADD COLUMN new_user_id VARCHAR(36) NULL"
            ))
            conn.commit()

        logger.info("为所有分类生成 UUID...")
        result = conn.execute(text("SELECT id FROM categories"))
        categories = result.fetchall()

        for category in categories:
            old_id = category[0]
            new_uuid = generate_uuid()
            conn.execute(
                text("UPDATE categories SET new_id = :new_id WHERE id = :old_id"),
                {"new_id": new_uuid, "old_id": old_id}
            )
        conn.commit()

        # 处理 parent_id 自引用
        if 'parent_id' in columns:
            logger.info("更新 categories.parent_id...")
            conn.execute(text(
                "UPDATE categories c1 JOIN categories c2 ON c1.parent_id = c2.id "
                "SET c1.new_parent_id = c2.new_id "
                "WHERE c1.parent_id IS NOT NULL"
            ))
            conn.commit()

        # 更新 notes.category_id
        if 'notes' in inspector.get_table_names():
            logger.info("更新 notes.category_id...")
            conn.execute(text(
                "UPDATE notes n JOIN categories c ON n.category_id = c.id "
                "SET n.new_category_id = c.new_id "
                "WHERE n.category_id IS NOT NULL"
            ))
            conn.commit()


def migrate_tags_table(engine):
    """迁移 tags 表"""
    logger.info("开始迁移 tags 表...")

    with engine.connect() as conn:
        inspector = inspect(engine)
        columns = [col['name'] for col in inspector.get_columns('tags')]

        if 'new_id' not in columns:
            logger.info("添加 new_id 列...")
            conn.execute(text(
                "ALTER TABLE tags ADD COLUMN new_id VARCHAR(36) NULL COMMENT '新的UUID ID'"
            ))
            conn.commit()

        # 检查 new_user_id 列
        if 'new_user_id' not in columns:
            conn.execute(text(
                "ALTER TABLE tags ADD COLUMN new_user_id VARCHAR(36) NULL"
            ))
            conn.commit()

        logger.info("为所有标签生成 UUID...")
        result = conn.execute(text("SELECT id FROM tags"))
        tags = result.fetchall()

        for tag in tags:
            old_id = tag[0]
            new_uuid = generate_uuid()
            conn.execute(
                text("UPDATE tags SET new_id = :new_id WHERE id = :old_id"),
                {"new_id": new_uuid, "old_id": old_id}
            )
        conn.commit()

        # 更新 note_tags 关联表
        if 'note_tags' in inspector.get_table_names():
            logger.info("更新 note_tags 关联表...")
            conn.execute(text(
                "ALTER TABLE note_tags ADD COLUMN new_tag_id VARCHAR(36) NULL"
            ))
            conn.execute(text(
                "ALTER TABLE note_tags ADD COLUMN new_note_id VARCHAR(36) NULL"
            ))
            conn.commit()

            conn.execute(text(
                "UPDATE note_tags nt JOIN tags t ON nt.tag_id = t.id "
                "SET nt.new_tag_id = t.new_id"
            ))
            conn.execute(text(
                "UPDATE note_tags nt JOIN notes n ON nt.note_id = n.id "
                "SET nt.new_note_id = n.new_id"
            ))
            conn.commit()


def migrate_notes_table(engine):
    """迁移 notes 表"""
    logger.info("开始迁移 notes 表...")

    with engine.connect() as conn:
        inspector = inspect(engine)
        columns = [col['name'] for col in inspector.get_columns('notes')]

        if 'new_id' not in columns:
            logger.info("添加 new_id 列...")
            conn.execute(text(
                "ALTER TABLE notes ADD COLUMN new_id VARCHAR(36) NULL COMMENT '新的UUID ID'"
            ))
            conn.commit()

        # 检查并添加外键列
        if 'new_user_id' not in columns:
            conn.execute(text(
                "ALTER TABLE notes ADD COLUMN new_user_id VARCHAR(36) NULL"
            ))
            conn.commit()

        if 'new_category_id' not in columns:
            conn.execute(text(
                "ALTER TABLE notes ADD COLUMN new_category_id VARCHAR(36) NULL"
            ))
            conn.commit()

        logger.info("为所有笔记生成 UUID...")
        result = conn.execute(text("SELECT id FROM notes"))
        notes = result.fetchall()

        for note in notes:
            old_id = note[0]
            new_uuid = generate_uuid()
            conn.execute(
                text("UPDATE notes SET new_id = :new_id WHERE id = :old_id"),
                {"new_id": new_uuid, "old_id": old_id}
            )
        conn.commit()


def rebuild_tables(engine):
    """
    重建表结构（删除旧列，重命名新列）

    ⚠️  此操作会删除旧的主键列
    """
    logger.info("开始重建表结构...")

    with engine.connect() as conn:
        # 由于 MySQL 的限制，需要分步处理
        # 1. 删除外键约束
        # 2. 删除旧列
        # 3. 重命名新列
        # 4. 重新设置主键
        # 5. 重新添加外键约束

        logger.info("⚠️  表结构重建需要手动执行或使用专门的迁移工具（如 Alembic）")
        logger.info("当前迁移已完成 UUID 生成和关联更新，请手动执行以下步骤：")
        logger.info("1. 备份数据库")
        logger.info("2. 使用数据库管理工具或手动 SQL 重建表结构")
        logger.info("3. 删除旧的 id 列")
        logger.info("4. 将 new_id 重命名为 id")
        logger.info("5. 重新设置主键和外键")


def main():
    """执行迁移"""
    try:
        logger.info("开始 ID 类型迁移：Integer -> UUID String")
        logger.info(f"数据库: {settings.MYSQL_HOST}:{settings.MYSQL_PORT}/{settings.MYSQL_DB}")

        # 创建数据库连接
        db_url = (
            f"mysql+pymysql://{settings.MYSQL_USER}:{settings.MYSQL_PASSWORD}"
            f"@{settings.MYSQL_HOST}:{settings.MYSQL_PORT}/{settings.MYSQL_DB}"
            f"?charset=utf8mb4"
        )
        engine = create_engine(db_url, pool_pre_ping=True)

        # 检查表是否使用旧 schema（integer id）
        inspector = inspect(engine)

        if 'users' not in inspector.get_table_names():
            logger.error("users 表不存在，无法迁移")
            return

        users_columns = inspector.get_columns('users')
        id_column_type = next((col['type'] for col in users_columns if col['name'] == 'id'), None)

        logger.info(f"users.id 列类型: {id_column_type}")

        if 'VARCHAR' in str(id_column_type).upper():
            logger.info("✅ 数据库已使用 UUID String 类型，无需迁移")
            return

        logger.info("⚠️  数据库使用 Integer ID 类型，开始迁移...")

        # 执行迁移
        migrate_users_table(engine)
        migrate_categories_table(engine)
        migrate_tags_table(engine)
        migrate_notes_table(engine)
        rebuild_tables(engine)

        logger.info("✅ 迁移准备完成！")
        logger.info("⚠️  注意：还需要手动重建表结构才能完成迁移")

    except Exception as e:
        logger.error(f"❌ 迁移失败: {str(e)}")
        raise


if __name__ == "__main__":
    main()
