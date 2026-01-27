/**
 * API 服务
 * 封装所有 HTTP 请求
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'
import { message } from 'antd'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UserProfile,
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  Tag,
  CreateTagRequest,
  UpdateTagRequest,
  Note,
  CreateNoteRequest,
  UpdateNoteRequest,
  NoteListParams,
  PaginatedResponse,
} from '../types'

// 创建 axios 实例
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器：添加 Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('[Request]', config.method?.toUpperCase(), config.url, 'Token:', token.substring(0, 20) + '...')
    } else {
      console.log('[Request]', config.method?.toUpperCase(), config.url, 'No token')
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器：处理错误
api.interceptors.response.use(
  (response) => {
    console.log('[Response]', response.config?.url, response.status)
    return response.data
  },
  (error: AxiosError<any>) => {
    const url = error.config?.url || ''
    console.log('[API Error]', error.response?.status, url)

    // 处理 401 未授权错误
    if (error.response?.status === 401) {
      // 如果是登录或注册接口返回401，不处理（让登录页面处理错误提示）
      const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register')

      if (isAuthEndpoint) {
        console.log('[401] Auth endpoint error, not redirecting')
        return Promise.reject(error)
      }

      // 清除本地存储的认证信息
      console.log('[401] Clearing token and redirecting to login')
      localStorage.removeItem('token')
      localStorage.removeItem('username')

      // 显示错误消息
      const errorMessage = error.response?.data?.detail || '登录已过期，请重新登录'
      message.error(errorMessage)

      // 重定向到登录页（如果不在登录页）
      const currentPath = window.location.pathname
      if (currentPath !== '/login' && currentPath !== '/register') {
        console.log('[401] Redirecting to login from', currentPath)
        window.location.href = '/login'
      }

      return Promise.reject(error)
    }

    // 处理其他错误
    const errorMessage = error.response?.data?.detail || '请求失败，请稍后重试'
    message.error(errorMessage)
    return Promise.reject(error)
  }
)

/**
 * 认证相关 API
 */
export const authAPI = {
  // 用户注册
  register: (data: RegisterRequest): Promise<UserProfile> =>
    api.post('/api/auth/register', data),

  // 用户登录
  login: (data: LoginRequest): Promise<LoginResponse> =>
    api.post('/api/auth/login', data),

  // 获取用户信息
  getProfile: (): Promise<UserProfile> =>
    api.get('/api/auth/profile'),

  // 更新用户信息
  updateProfile: (data: Partial<UserProfile>): Promise<UserProfile> =>
    api.put('/api/auth/profile', data),

  // 修改密码
  changePassword: (data: { old_password: string; new_password: string }): Promise<{ message: string }> =>
    api.post('/api/auth/change-password', data),

  // 上传头像
  uploadAvatar: (file: File): Promise<{ avatar_url: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/api/auth/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // 用户登出
  logout: (): Promise<{ message: string }> =>
    api.post('/api/auth/logout'),
}

/**
 * 分类相关 API
 */
export const categoryAPI = {
  // 获取分类列表
  getCategories: (params?: AxiosRequestConfig['params']): Promise<Category[]> =>
    api.get('/api/categories', { params }),

  // 创建分类
  createCategory: (data: CreateCategoryRequest): Promise<Category> =>
    api.post('/api/categories', data),

  // 获取分类详情
  getCategory: (id: number): Promise<Category> =>
    api.get(`/api/categories/${id}`),

  // 更新分类
  updateCategory: (id: number, data: UpdateCategoryRequest): Promise<Category> =>
    api.put(`/api/categories/${id}`, data),

  // 删除分类
  deleteCategory: (id: number): Promise<void> =>
    api.delete(`/api/categories/${id}`),
}

/**
 * 标签相关 API
 */
export const tagAPI = {
  // 获取标签列表
  getTags: (params?: AxiosRequestConfig['params']): Promise<Tag[]> =>
    api.get('/api/tags', { params }),

  // 创建标签
  createTag: (data: CreateTagRequest): Promise<Tag> =>
    api.post('/api/tags', data),

  // 获取标签详情
  getTag: (id: number): Promise<Tag> =>
    api.get(`/api/tags/${id}`),

  // 更新标签
  updateTag: (id: number, data: UpdateTagRequest): Promise<Tag> =>
    api.put(`/api/tags/${id}`, data),

  // 删除标签
  deleteTag: (id: number): Promise<void> =>
    api.delete(`/api/tags/${id}`),
}

/**
 * 笔记相关 API
 */
export const noteAPI = {
  // 获取笔记列表
  getNotes: (params: NoteListParams): Promise<PaginatedResponse<Note>> =>
    api.get('/api/notes', { params }),

  // 搜索笔记
  searchNotes: (keyword: string): Promise<{ results: Note[]; total: number }> =>
    api.get('/api/notes/search', { params: { keyword } }),

  // 创建笔记
  createNote: (data: CreateNoteRequest): Promise<Note> =>
    api.post('/api/notes', data),

  // 获取笔记详情
  getNoteDetail: (id: number | string): Promise<Note> =>
    api.get(`/api/notes/${id}`),

  getNote: (id: number | string): Promise<Note> =>
    api.get(`/api/notes/${id}`), // 别名，兼容性

  // 更新笔记
  updateNote: (id: number | string, data: UpdateNoteRequest): Promise<Note> =>
    api.put(`/api/notes/${id}`, data),

  // 删除笔记
  deleteNote: (id: number | string): Promise<void> =>
    api.delete(`/api/notes/${id}`),
}

export default api
