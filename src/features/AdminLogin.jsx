import React, { useState } from 'react'
import { useLoginMutation } from '../store/api/authApi'
import { useDispatch } from 'react-redux'
import { setUser } from '../store/slices/authSlice'

export default function AdminLogin(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [login,{isLoading,error}] = useLoginMutation()
  const dispatch = useDispatch()

  async function handle(e){
    e.preventDefault()
    try{
      const res = await login({email,password}).unwrap()
      if(res.user){
        setMessage('Login successful')
        dispatch(setUser(res.user))
        window.history.pushState({}, '', '/admin')
        window.dispatchEvent(new PopStateEvent('popstate'))
      }
    }catch(err){
      console.error(err)
      setMessage(err?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-pink-50 to-yellow-50 p-6">
      <div className="absolute top-6 left-6">
        <button onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')) }} className="px-3 py-2 bg-white/80 rounded-lg shadow">Back to menu</button>
      </div>

      <form onSubmit={handle} className="w-full max-w-md bg-white/60 backdrop-blur-md border border-white/40 rounded-3xl p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">Admin Portal</h1>
          <p className="text-sm text-gray-600 mt-1">Sign in to manage the menu</p>
        </div>

        {message ? <div className="mb-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">{message}</div> : null}
        {error?.data?.error ? <div className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error.data.error}</div> : null}

        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 mb-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" />
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full p-3 mb-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none" />

        <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-2xl shadow-md hover:opacity-95">{isLoading? 'Signing...':'Sign In'}</button>

        <div className="mt-4 text-center text-sm text-gray-500">Use your admin credentials to access the dashboard.</div>
      </form>
    </div>
  )
}
