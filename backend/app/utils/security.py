"""
安全相关工具函数
密码加密和验证
"""
import bcrypt


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    验证密码

    Args:
        plain_password: 明文密码
        hashed_password: 哈希密码

    Returns:
        bool: 密码是否匹配
    """
    # bcrypt 有72字节的限制，始终截断到安全长度（50个字符）
    # 这样可以完全避免超过72字节的错误，同时保持足够的密码强度
    plain_password = plain_password[:50]
    # 将字符串转换为字节
    plain_password_bytes = plain_password.encode('utf-8')
    hashed_password_bytes = hashed_password.encode('utf-8') if isinstance(hashed_password, str) else hashed_password
    return bcrypt.checkpw(plain_password_bytes, hashed_password_bytes)


def get_password_hash(password: str) -> str:
    """
    获取密码哈希

    Args:
        password: 明文密码

    Returns:
        str: 哈希后的密码
    """
    # bcrypt 有72字节的限制，始终截断到安全长度（50个字符）
    # 这样可以完全避免超过72字节的错误，同时保持足够的密码强度
    password = password[:50]
    # 生成盐值并哈希密码
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    # 返回字符串格式的哈希值
    return hashed.decode('utf-8')
