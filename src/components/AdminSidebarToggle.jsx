'use client'

import { useEffect, useState } from 'react'

export default function AdminSidebarToggle() {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const layout = document.querySelector('.admin-layout')
    layout?.classList.toggle('admin-sidebar-collapsed', collapsed)

    return () => {
      layout?.classList.remove('admin-sidebar-collapsed')
    }
  }, [collapsed])

  return (
    <button
      type="button"
      className="admin-sidebar-toggle-btn"
      aria-expanded={!collapsed}
      title={collapsed ? 'Abrir menu' : 'Fechar menu'}
      onClick={() => setCollapsed((current) => !current)}
    >
      <span aria-hidden="true">{collapsed ? '>' : '<'}</span>
      <span className="sr-only">{collapsed ? 'Abrir menu' : 'Fechar menu'}</span>
    </button>
  )
}
