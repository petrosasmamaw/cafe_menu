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
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-[#e8e4de] rounded-2xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-9 h-9 bg-[#6b3e26] rounded-lg flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
              <line x1="6" y1="2" x2="6" y2="4" />
              <line x1="10" y1="2" x2="10" y2="4" />
              <line x1="14" y1="2" x2="14" y2="4" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-lg font-medium text-[#1a1a1a] mb-1">Sign in</h1>
          <p className="text-sm text-gray-400">Manage your café</p>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 bg-[#e6f2e8] border border-[#bce0c4] text-[#3a7a42] px-4 py-3 rounded-lg text-sm">
            {message}
          </div>
        )}
        {error?.data?.error && (
          <div className="mb-6 bg-[#fde8e8] border border-[#f0bcbc] text-[#a32d2d] px-4 py-3 rounded-lg text-sm">
            {error.data.error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handle} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-[#f5f3ef] border border-[#e8e4de] rounded-lg px-4 py-2.5 text-sm text-[#1a1a1a] placeholder-gray-400 focus:ring-2 focus:ring-[#c77e3a]/20"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={e=>setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-[#f5f3ef] border border-[#e8e4de] rounded-lg px-4 py-2.5 text-sm text-[#1a1a1a] placeholder-gray-400 focus:ring-2 focus:ring-[#c77e3a]/20"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#c77e3a] text-white rounded-lg py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Back link */}
        <div className="mt-6 text-center">
          <a href="/" className="text-[#c77e3a] text-sm hover:opacity-80">
            ← Back to menu
          </a>
        </div>
      </div>
    </div>
  )
}