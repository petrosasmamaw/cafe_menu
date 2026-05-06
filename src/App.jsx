import React, { useEffect, useState } from 'react'
import Home from './features/Home'
import AdminLogin from './features/AdminLogin'
import AdminDashboard from './features/AdminDashboard'
import { useGetMeQuery } from './store/api/authApi'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from './store/slices/authSlice'

function PrivateRoute({ children }) {
  const { isAuthenticated } = useSelector((s) => s.auth)
  return isAuthenticated ? children : <AdminLogin />
}

export default function App() {
  const { isAuthenticated } = useSelector((s) => s.auth)
  const { data } = useGetMeQuery(undefined, { skip: isAuthenticated })
  const dispatch = useDispatch()
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    if (data?.user) dispatch(setUser(data.user))
  }, [data, dispatch])

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  function renderRoute() {
    if (path === '/admin/login') return <AdminLogin />
    if (path === '/admin') {
      return (
        <PrivateRoute>
          <AdminDashboard />
        </PrivateRoute>
      )
    }
    return <Home />
  }

  return <div className="min-h-screen bg-white text-gray-900">{renderRoute()}</div>
}


