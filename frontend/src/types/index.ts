/**
 * 全局类型定义
 */

// ==================== API 响应类型 ====================

export interface ApiResponse<T = any> {
  data: T
  code?: number
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
}

// ==================== 认证相关类型 ====================

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
}

export interface UserProfile {
  id: number
  username: string
  email: string
  avatar?: string
  avatar_url?: string
  theme_preference: string
  primary_color: string
  created_at: string
  updated_at: string
}

// ==================== 分类类型 ====================

export interface Category {
  id: number
  name: string
  description?: string
  created_at: string
}

export interface CreateCategoryRequest {
  name: string
  description?: string
}

export interface UpdateCategoryRequest {
  name?: string
  description?: string
}

// ==================== 标签类型 ====================

export interface Tag {
  id: number
  name: string
  created_at: string
}

export interface CreateTagRequest {
  name: string
}

export interface UpdateTagRequest {
  name?: string
}

// ==================== 笔记类型 ====================

export interface Note {
  id: number
  title: string
  content: string
  summary?: string
  category_id?: number
  category?: Category
  tags: Tag[]
  tag_ids?: number[]
  is_favorite: boolean
  view_count: number
  created_at: string
  updated_at: string
}

export interface CreateNoteRequest {
  title: string
  content: string
  summary?: string
  category_id?: number
  tag_ids?: number[]
  is_favorite?: boolean
}

export interface UpdateNoteRequest {
  title?: string
  content?: string
  summary?: string
  category_id?: number
  tag_ids?: number[]
  is_favorite?: boolean
}

export interface NoteListParams {
  page?: number
  page_size?: number
  keyword?: string
  category_id?: number | null
  tag_id?: number
  is_favorite?: boolean | null
}

// ==================== 主题类型 ====================

export interface ThemeContextValue {
  isDark: boolean
  toggleTheme: (theme?: 'light' | 'dark' | 'system') => void
  primaryColor: string
  changePrimaryColor: (color: string) => void
  themeMode: 'light' | 'dark' | 'system'
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void
}

// ==================== 路由类型 ====================

export interface ProtectedRouteProps {
  children: React.ReactNode
}

export interface MainLayoutProps {
  children: React.ReactNode
}

export interface HeaderProps {
  collapsed: boolean
  onToggle: () => void
}

export interface SidebarProps {
  collapsed: boolean
}

// ==================== 组件 Props 类型 ====================

export interface BaseComponentProps {
  className?: string
  style?: React.CSSProperties
}

// ==================== 菜单项类型 ====================

export interface MenuItem {
  key: string
  icon?: React.ReactNode
  label: string
  onClick?: () => void
  type?: string
}

// ==================== 表单类型 ====================

export interface LoginFormValues {
  username: string
  password: string
}

export interface NoteFormValues {
  title: string
  content: string
  category_id?: number
  tag_ids?: number[]
}
