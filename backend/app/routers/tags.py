"""
标签相关路由
标签的增删改查操作
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Tag, User
from app.schemas.tag import TagCreate, TagUpdate, TagResponse
from app.dependencies import get_current_user

router = APIRouter(tags=["标签"])


@router.get("", response_model=List[TagResponse])
def get_tags(
    skip: int = Query(0, ge=0, description="跳过记录数"),
    limit: int = Query(100, ge=1, le=100, description="返回记录数"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    获取标签列表

    Args:
        skip: 跳过的记录数
        limit: 返回的记录数
        current_user: 当前登录用户
        db: 数据库会话

    Returns:
        List[TagResponse]: 标签列表
    """
    tags = db.query(Tag).filter(
        Tag.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    return tags


@router.post("", response_model=TagResponse, status_code=status.HTTP_201_CREATED)
def create_tag(
    tag: TagCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    创建标签

    Args:
        tag: 标签数据
        current_user: 当前登录用户
        db: 数据库会话

    Returns:
        TagResponse: 创建的标签信息

    Raises:
        HTTPException: 标签名称已存在
    """
    # 检查标签名称是否已存在
    existing = db.query(Tag).filter(
        Tag.user_id == current_user.id,
        Tag.name == tag.name
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="标签名称已存在"
        )

    db_tag = Tag(**tag.model_dump(), user_id=current_user.id)
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)

    return db_tag


@router.get("/{tag_id}", response_model=TagResponse)
def get_tag(
    tag_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    获取标签详情

    Args:
        tag_id: 标签ID
        current_user: 当前登录用户
        db: 数据库会话

    Returns:
        TagResponse: 标签详情

    Raises:
        HTTPException: 标签不存在或无权访问
    """
    tag = db.query(Tag).filter(
        Tag.id == tag_id,
        Tag.user_id == current_user.id
    ).first()

    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="标签不存在"
        )

    return tag


@router.put("/{tag_id}", response_model=TagResponse)
def update_tag(
    tag_id: str,
    tag_update: TagUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    更新标签

    Args:
        tag_id: 标签ID
        tag_update: 更新数据
        current_user: 当前登录用户
        db: 数据库会话

    Returns:
        TagResponse: 更新后的标签信息

    Raises:
        HTTPException: 标签不存在或无权访问
    """
    tag = db.query(Tag).filter(
        Tag.id == tag_id,
        Tag.user_id == current_user.id
    ).first()

    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="标签不存在"
        )

    # 更新字段
    update_data = tag_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(tag, field, value)

    db.commit()
    db.refresh(tag)

    return tag


@router.delete("/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tag(
    tag_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    删除标签

    Args:
        tag_id: 标签ID
        current_user: 当前登录用户
        db: 数据库会话

    Raises:
        HTTPException: 标签不存在或无权访问
    """
    tag = db.query(Tag).filter(
        Tag.id == tag_id,
        Tag.user_id == current_user.id
    ).first()

    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="标签不存在"
        )

    db.delete(tag)
    db.commit()

    return None
