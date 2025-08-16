import React from 'react'

export default function ConfirmModal({ open, title, message, onConfirmClear, onConfirmKeep, onCancel }){
  if(!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-4 rounded shadow max-w-md w-full">
        <h3 className="font-semibold mb-2">{title}</h3>
        <div className="text-sm text-gray-700 mb-4">{message}</div>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-3 py-1 rounded bg-gray-200">Cancel</button>
          <button onClick={onConfirmKeep} className="px-3 py-1 rounded bg-blue-600 text-white">Keep and Switch</button>
          <button onClick={onConfirmClear} className="px-3 py-1 rounded bg-red-600 text-white">Clear & Switch</button>
        </div>
      </div>
    </div>
  )
}
