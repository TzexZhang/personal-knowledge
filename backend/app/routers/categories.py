"""
分类相关路由
分类的增删改查操作
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Category, User, Note
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.dependencies import get_current_user

router = APIRouter(tags=["分类"])


@router.get("", response_model=List[CategoryResponse])
def get_categories(
    skip: int = Query(0, ge=0, description="跳过记录数"),
    limit: int = Query(100, ge=1, le=100, description="返回记录数"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    获取分类列表

    Args:
        skip: 跳过的记录数
        limit: 返回的记录数
        current_user: 当前登录用户
        db: 数据库会话

    Returns:
        List[CategoryResponse]: 分类列表
    """
    categories = db.query(Category).filter(
        Category.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    return categories


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    category: CategoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    创建分类

    Args:
        category: 分类数据
        current_user: 当前登录用户
        db: 数据库会话

    Returns:
        CategoryResponse: 创建的分类信息
    """
    # 检查分类名称是否已存在
    existing = db.query(Category).filter(
        Category.user_id == current_user.id,
        Category.name == category.name
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="分类名称已存在"
        )

    db_category = Category(**category.model_dump(), user_id=current_user.id)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)

    return db_category


@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(
    category_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    获取分类详情

    Args:
        category_id: 分类ID
        current_user: 当前登录用户
        db: 数据库会话

    Returns:
        CategoryResponse: 分类详情

    Raises:
        HTTPException: 分类不存在或无权访问
    """
    category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user.id
    ).first()

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="分类不存在"
        )

    return category


@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: str,
    category_update: CategoryUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    更新分类

    Args:
        category_id: 分类ID
        category_update: 更新数据
        current_user: 当前登录用户
        db: 数据库会话

    Returns:
        CategoryResponse: 更新后的分类信息

    Raises:
        HTTPException: 分类不存在或无权访问
    """
    category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user.id
    ).first()

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="分类不存在"
        )

    # 更新字段
    update_data = category_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(category, field, value)

    db.commit()
    db.refresh(category)

    return category


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    删除分类

    Args:
        category_id: 分类ID
        current_user: 当前登录用户
        db: 数据库会话

    Raises:
        HTTPException: 分类不存在或无权访问
    """
    category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user.id
    ).first()

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="分类不存在"
        )

    db.delete(category)
    db.commit()

    return None
