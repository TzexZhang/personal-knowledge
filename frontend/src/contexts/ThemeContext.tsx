/**
 * 主题上下文
 * 管理全局主题状态（明暗模式切换）
 */
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { ConfigProvider, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import type { ThemeContextValue } from '../types'

// 创建主题上下文
const ThemeContext = createContext<ThemeContextValue | null>(null)

interface ThemeProviderProps {
  children: ReactNode
}

/**
 * 主题提供者组件
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(false)
  const [primaryColor, setPrimaryColor] = useState<string>('#1890ff')
  const [themeMode, setThemeModeState] = useState<'light' | 'dark' | 'system'>('system')

  // 从 localStorage 读取用户偏好
  useEffect(() => {
    const savedThemeMode = localStorage.getItem('themeMode')
    const savedColor = localStorage.getItem('primaryColor')

    if (savedThemeMode) {
      setThemeModeState(savedThemeMode as 'light' | 'dark' | 'system')
      if (savedThemeMode !== 'system') {
        setIsDark(savedThemeMode === 'dark')
      } else {
        // 跟随系统主题
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setIsDark(prefersDark)
      }
    } else {
      // 默认跟随系统
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDark(prefersDark)
    }

    if (savedColor) {
      setPrimaryColor(savedColor)
    }
  }, [])

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent | Event) => {
      if (themeMode === 'system') {
        setIsDark((e as MediaQueryListEvent).matches)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [themeMode])

  // 根据主题模式设置 data-theme 属性
  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.setAttribute('data-theme', 'dark')
    } else {
      root.setAttribute('data-theme', 'light')
    }
  }, [isDark])

  // 切换主题
  const toggleTheme = useCallback((theme?: 'light' | 'dark' | 'system') => {
    const newTheme = theme || (isDark ? 'light' : 'dark')

    if (newTheme === 'system') {
      setThemeModeState('system')
      localStorage.setItem('themeMode', 'system')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDark(prefersDark)
    } else {
      setThemeModeState(newTheme)
      localStorage.setItem('themeMode', newTheme)
      setIsDark(newTheme === 'dark')
    }
  }, [isDark, themeMode])

  // 设置主题模式（供设置页面使用）
  const setThemeMode = useCallback((mode: 'light' | 'dark' | 'system') => {
    toggleTheme(mode)
  }, [toggleTheme])

  // 更改主色调
  const changePrimaryColor = useCallback((color: string) => {
    setPrimaryColor(color)
    localStorage.setItem('primaryColor', color)
  }, [])

  // 主题配置
  const themeConfig = {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: primaryColor,
      borderRadius: 6,
    },
  }

  const value: ThemeContextValue = {
    isDark,
    toggleTheme,
    primaryColor,
    changePrimaryColor,
    themeMode,
    setThemeMode,
  }

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider theme={themeConfig} locale={zhCN}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}

/**
 * 使用主题 Hook
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export default ThemeContext
