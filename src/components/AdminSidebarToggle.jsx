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
      onClick={() => setCollapsed((current) => !current)}
    >
      {collapsed ? 'Abrir menu' : 'Fechar menu'}
    </button>
  )
}
