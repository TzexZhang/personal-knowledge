"""
笔记相关路由
笔记的增删改查和搜索操作
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from typing import List, Optional

from app.database import get_db
from app.models import Note, User, Tag, Category
from app.schemas.note import NoteCreate, NoteUpdate, NoteResponse, NoteListResponse, NoteSearchResponse
from app.dependencies import get_current_user

router = APIRouter(tags=["笔记"])


@router.get("", response_model=NoteListResponse)
def get_notes(
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页记录数"),
    category_id: Optional[int] = Query(None, description="分类ID筛选"),
    tag_id: Optional[int] = Query(None, description="标签ID筛选"),
    is_favorite: Optional[bool] = Query(None, description="是否收藏筛选"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    获取笔记列表（支持分页和筛选）

    Args:
        page: 页码
        page_size: 每页记录数
        category_id: 分类ID
        tag_id: 标签ID
        is_favorite: 是否收藏
        current_user: 当前登录用户
        db: 数据库会话

    Returns:
        NoteListResponse: 笔记列表
    """
    # 构建查询
    query = db.query(Note).options(
        joinedload(Note.category),
        joinedload(Note.tags)
    ).filter(Note.user_id == current_user.id)

    # 应用筛选条件
    if category_id is not None:
        query = query.filter(Note.category_id == category_id)
    if tag_id is not None:
        query = query.join(Note.tags).filter(Tag.id == tag_id)
    if is_favorite is not None:
        query = query.filter(Note.is_favorite == is_favorite)

    # 计算总数
    total = query.count()

    # 分页查询
    skip = (page - 1) * page_size
    notes = query.order_by(Note.updated_at.desc()).offset(skip).limit(page_size).all()

    return NoteListResponse(
        items=notes,
        total=total,
        page=page,
        page_size=page_size
    )


@router.get("/search", response_model=NoteSearchResponse)
def search_notes(
    keyword: str = Query(..., min_length=1, description="搜索关键词"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    搜索笔记

    Args:
        keyword: 搜索关键词
        current_user: 当前登录用户
        db: 数据库会话

    Returns:
        NoteSearchResponse: 搜索结果
    """
    # 构建搜索查询（在标题和内容中搜索）
    query = db.query(Note).filter(
        Note.user_id == current_user.id,
        or_(
            Note.title.like(f"%{keyword}%"),
            Note.content.like(f"%{keyword}%")
        )
    )

    notes = query.order_by(Note.updated_at.desc()).all()
    total = query.count()

    return NoteSearchResponse(
        results=notes,
        total=total
    )


@router.post("", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
def create_note(
    note: NoteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    创建笔记

    Args:
        note: 笔记数据
        current_user: 当前登录用户
        db: 数据库会话

    Returns:
        NoteResponse: 创建的笔记信息
    """
    # 创建笔记
    db_note = Note(
        title=note.title,
        content=note.content,
        category_id=note.category_id,
        is_favorite=note.is_favorite,
        user_id=current_user.id
    )
    db.add(db_note)
    db.flush()  # 刷新以获取 note.id

    # 关联标签
    if note.tag_ids:
        tags = db.query(Tag).filter(
            Tag.id.in_(note.tag_ids),
            Tag.user_id == current_user.id
        ).all()
        db_note.tags = tags

    db.commit()
    db.refresh(db_note)

    return db_note


@router.get("/{note_id}", response_model=NoteResponse)
def get_note(
    note_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    获取笔记详情

    Args:
        note_id: 笔记ID
        current_user: 当前登录用户
        db: 数据库会话

    Returns:
        NoteResponse: 笔记详情

    Raises:
        HTTPException: 笔记不存在或无权访问
    """
    note = db.query(Note).options(
        joinedload(Note.category),
        joinedload(Note.tags)
    ).filter(
        Note.id == note_id,
        Note.user_id == current_user.id
    ).first()

    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="笔记不存在"
        )

    # 增加浏览次数
    note.view_count += 1
    db.commit()
    db.refresh(note)

    return note


@router.put("/{note_id}", response_model=NoteResponse)
def update_note(
    note_id: int,
    note_update: NoteUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    更新笔记

    Args:
        note_id: 笔记ID
        note_update: 更新数据
        current_user: 当前登录用户
        db: 数据库会话

    Returns:
        NoteResponse: 更新后的笔记信息

    Raises:
        HTTPException: 笔记不存在或无权访问
    """
    note = db.query(Note).filter(
        Note.id == note_id,
        Note.user_id == current_user.id
    ).first()

    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="笔记不存在"
        )

    # 更新字段
    update_data = note_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if field != "tag_ids":  # 暂时跳过 tag_ids
            setattr(note, field, value)

    # 更新标签关联
    if note_update.tag_ids is not None:
        tags = db.query(Tag).filter(
            Tag.id.in_(note_update.tag_ids),
            Tag.user_id == current_user.id
        ).all()
        note.tags = tags

    db.commit()
    db.refresh(note)

    return note


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(
    note_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    删除笔记

    Args:
        note_id: 笔记ID
        current_user: 当前登录用户
        db: 数据库会话

    Raises:
        HTTPException: 笔记不存在或无权访问
    """
    note = db.query(Note).filter(
        Note.id == note_id,
        Note.user_id == current_user.id
    ).first()

    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="笔记不存在"
        )

    db.delete(note)
    db.commit()

    return None
