"""
数据库迁移脚本
用于在生产环境中创建和验证数据库表
"""
import sys
from pathlib import Path

# 添加项目根目录到 Python 路径
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.database import engine, Base
from sqlalchemy import text

def migrate():
    """执行数据库迁移"""
    print("=" * 60)
    print("数据库迁移开始")
    print("=" * 60)

    try:
        # 创建所有表
        print("\n1. 创建数据库表...")
        Base.metadata.create_all(bind=engine)
        print("✅ 数据库表创建成功！")

        # 验证表是否创建成功
        print("\n2. 验证表结构...")
        with engine.connect() as conn:
            result = conn.execute(text("SHOW TABLES"))
            tables = result.fetchall()
            print(f"✅ 当前数据库表: {[table[0] for table in tables]}")

        # 验证表结构
        print("\n3. 验证表字段...")
        with engine.connect() as conn:
            # 检查 users 表
            result = conn.execute(text("DESCRIBE users"))
            print("✅ users 表字段:")
            for row in result:
                print(f"   - {row[0]}: {row[1]}")

        print("\n" + "=" * 60)
        print("✅ 数据库迁移完成！")
        print("=" * 60)

    except Exception as e:
        print(f"\n❌ 迁移失败: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    migrate()
