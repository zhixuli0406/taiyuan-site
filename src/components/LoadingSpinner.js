import React from 'react'

/**
 * 載入動畫組件
 * 顯示一個旋轉的圓形動畫，用於表示正在載入的狀態
 */
const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  )
}

export default LoadingSpinner 