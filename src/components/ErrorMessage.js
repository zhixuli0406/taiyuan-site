import React from 'react'

/**
 * 錯誤訊息組件
 * 用於顯示錯誤訊息，支援自定義錯誤內容
 * @param {string} message - 要顯示的錯誤訊息
 */
const ErrorMessage = ({ message }) => {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">錯誤：</strong>
        <span className="block sm:inline">{message || '發生了一個錯誤'}</span>
      </div>
    </div>
  )
}

export default ErrorMessage 