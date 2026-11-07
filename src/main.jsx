import React, { Suspense, lazy, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// the admin panel is a separate chunk, only downloaded at  /#/admin
const Admin = lazy(() => import('./admin/Admin.jsx'))
const wantsAdmin = () => location.hash.startsWith('#/admin')

function Root() {
  const [admin, setAdmin] = useState(wantsAdmin())
  useEffect(() => {
    const on = () => setAdmin(wantsAdmin())
    addEventListener('hashchange', on)
    return () => removeEventListener('hashchange', on)
  }, [])
  return admin ? (
    <Suspense fallback={null}>
      <Admin />
    </Suspense>
  ) : (
    <App />
  )
}

createRoot(document.getElementById('root')).render(<Root />)
