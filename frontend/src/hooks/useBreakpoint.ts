/**
 * 响应式断点 Hook
 * 监听屏幕尺寸变化，返回是否为移动端
 */
import { useState, useEffect } from 'react'

export function useBreakpoint(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)

    // 清理监听器
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return isMobile
}
