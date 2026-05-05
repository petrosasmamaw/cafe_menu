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
    <div className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 15%, #6a5a4a 30%, #d4924a 50%, #f5e8d4 100%)',
        backgroundColor: '#f5f1e8'
      }}
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-orange-400/10 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl animate-pulse" style={{animationDelay: '1.5s'}} />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-yellow-400/10 blur-3xl animate-pulse" style={{animationDelay: '2.5s'}} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        {/* Back button */}
        <button 
          onClick={() => { 
            window.history.pushState({}, '', '/'); 
            window.dispatchEvent(new PopStateEvent('popstate')) 
          }} 
          className="absolute top-8 left-8 px-4 py-2 glass text-gray-900 rounded-full font-semibold hover:bg-white/30 transition-smooth"
        >
          ← Back to Menu
        </button>

        {/* Form */}
        <form onSubmit={handle} className="w-full max-w-md">
          <div className="glass rounded-3xl p-8 backdrop-blur-xl border border-white/40">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="text-5xl mb-4">☕</div>
              <h1 className="text-3xl font-black text-gray-900 mb-2">Admin Portal</h1>
              <p className="text-gray-700 text-sm">Sign in to manage your café menu</p>
            </div>

            {/* Messages */}
            {message ? (
              <div className="mb-6 rounded-2xl bg-green-100 px-4 py-3 text-sm text-green-800 border border-green-300">
                ✓ {message}
              </div>
            ) : null}
            {error?.data?.error ? (
              <div className="mb-6 rounded-2xl bg-red-100 px-4 py-3 text-sm text-red-800 border border-red-300">
                ✗ {error.data.error}
              </div>
            ) : null}

            {/* Email input */}
            <input 
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              placeholder="Email address" 
              type="email"
              className="w-full p-4 mb-4 bg-white/40 border border-white/50 rounded-2xl focus:ring-2 focus:ring-[var(--accent)] outline-none text-gray-900 placeholder:text-gray-600 transition-smooth"
            />

            {/* Password input */}
            <input 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              type="password" 
              placeholder="Password" 
              className="w-full p-4 mb-6 bg-white/40 border border-white/50 rounded-2xl focus:ring-2 focus:ring-[var(--accent)] outline-none text-gray-900 placeholder:text-gray-600 transition-smooth"
            />

            {/* Submit button */}
            <button 
              disabled={isLoading}
              className="w-full py-3 bg-[var(--accent)] text-white font-bold rounded-2xl hover:bg-[var(--accent)]/90 disabled:opacity-50 transition-smooth shadow-lg mb-4"
            >
              {isLoading? '🔄 Signing in...':'Sign In'}
            </button>

            {/* Info */}
            <p className="text-center text-sm text-gray-700">
              Use your admin credentials
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
