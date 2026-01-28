"""
数据库迁移脚本：添加 color 和 sort_order 字段

执行方式：
python scripts/migrate_add_color_fields.py
"""
import sys
from pathlib import Path

# 添加项目根目录到 Python 路径
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import text, inspect
from app.database import engine
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def migrate_categories_table():
    """为 categories 表添加 color 和 sort_order 字段"""
    inspector = inspect(engine)
    columns = [col['name'] for col in inspector.get_columns('categories')]

    logger.info(f"categories 表当前字段: {columns}")

    with engine.connect() as conn:
        # 添加 color 字段
        if 'color' not in columns:
            logger.info("添加 color 字段到 categories 表...")
            conn.execute(text(
                "ALTER TABLE categories "
                "ADD COLUMN color VARCHAR(20) NULL COMMENT '分类颜色' AFTER description"
            ))
            conn.commit()
            logger.info("✅ color 字段添加成功")
        else:
            logger.info("color 字段已存在，跳过")

        # 添加 sort_order 字段
        if 'sort_order' not in columns:
            logger.info("添加 sort_order 字段到 categories 表...")
            conn.execute(text(
                "ALTER TABLE categories "
                "ADD COLUMN sort_order INT DEFAULT 0 COMMENT '排序顺序' AFTER color"
            ))
            conn.commit()
            logger.info("✅ sort_order 字段添加成功")
        else:
            logger.info("sort_order 字段已存在，跳过")


def migrate_tags_table():
    """为 tags 表添加 color 字段"""
    inspector = inspect(engine)

    # 检查 tags 表是否存在
    if 'tags' not in inspector.get_table_names():
        logger.info("tags 表不存在，跳过迁移")
        return

    columns = [col['name'] for col in inspector.get_columns('tags')]
    logger.info(f"tags 表当前字段: {columns}")

    with engine.connect() as conn:
        # 添加 color 字段
        if 'color' not in columns:
            logger.info("添加 color 字段到 tags 表...")
            conn.execute(text(
                "ALTER TABLE tags "
                "ADD COLUMN color VARCHAR(20) NULL COMMENT '标签颜色' AFTER name"
            ))
            conn.commit()
            logger.info("✅ tags 表 color 字段添加成功")
        else:
            logger.info("tags 表 color 字段已存在，跳过")


def main():
    """执行所有迁移"""
    try:
        logger.info("开始数据库迁移...")

        # 迁移 categories 表
        migrate_categories_table()

        # 迁移 tags 表
        migrate_tags_table()

        logger.info("✅ 数据库迁移完成！")

    except Exception as e:
        logger.error(f"❌ 迁移失败: {str(e)}")
        raise


if __name__ == "__main__":
    main()
