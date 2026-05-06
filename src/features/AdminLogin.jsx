import React, { useState } from 'react'
import { useLoginMutation } from '../store/api/authApi'
import { useDispatch } from 'react-redux'
import { setUser } from '../store/slices/authSlice'

const bgImage = 'https://images.openai.com/static-rsc-4/6WeZC4eUWalWirG924LJPD6RR7ixBZ4-3-nfFmZvWGU4MvCsEBISmLXditOqTZpfQVEPVmGlnxb0TZyOCllRJQcPTPGq217HvV_-qCIBAUXfcwu5TCpbSvtuBw40f6MIBntYEblhaGsibQJI4W-5fvYjwgHVoSmSy6FXGiVG3bN39NDB-uxxgR0y65btrezd?purpose=fullsize'

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
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url('${bgImage}')`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6">
        {/* Back button */}
        <button 
          onClick={() => { 
            window.history.pushState({}, '', '/'); 
            window.dispatchEvent(new PopStateEvent('popstate')) 
          }} 
          className="absolute top-4 sm:top-8 left-4 sm:left-8 px-3 sm:px-4 py-2 glass text-gray-900 rounded-full font-semibold hover:bg-white/30 transition-smooth text-sm sm:text-base"
        >
          ← Back to Menu
        </button>

        {/* Form */}
        <form onSubmit={handle} className="w-full max-w-md">
          <div className="glass rounded-3xl p-6 sm:p-8 backdrop-blur-xl border border-white/40">
            {/* Header */}
            <div className="mb-6 sm:mb-8 text-center">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">☕</div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1 sm:mb-2">Admin Portal</h1>
              <p className="text-gray-700 text-sm sm:text-base">Sign in to manage your café menu</p>
            </div>

            {/* Messages */}
            {message ? (
              <div className="mb-4 sm:mb-6 rounded-2xl bg-green-100 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-green-800 border border-green-300">
                ✓ {message}
              </div>
            ) : null}
            {error?.data?.error ? (
              <div className="mb-4 sm:mb-6 rounded-2xl bg-red-100 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-red-800 border border-red-300">
                ✗ {error.data.error}
              </div>
            ) : null}

            {/* Email input */}
            <input 
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              placeholder="Email address" 
              type="email"
              className="w-full p-3 sm:p-4 mb-3 sm:mb-4 bg-white/40 border border-white/50 rounded-2xl focus:ring-2 focus:ring-[var(--accent)] outline-none text-gray-900 placeholder:text-gray-600 transition-smooth text-sm sm:text-base"
            />

            {/* Password input */}
            <input 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              type="password" 
              placeholder="Password" 
              className="w-full p-3 sm:p-4 mb-4 sm:mb-6 bg-white/40 border border-white/50 rounded-2xl focus:ring-2 focus:ring-[var(--accent)] outline-none text-gray-900 placeholder:text-gray-600 transition-smooth text-sm sm:text-base"
            />

            {/* Submit button */}
            <button 
              disabled={isLoading}
              className="w-full py-2.5 sm:py-3 bg-[var(--accent)] text-white font-bold rounded-2xl hover:bg-[var(--accent)]/90 disabled:opacity-50 transition-smooth shadow-lg mb-3 sm:mb-4 text-sm sm:text-base"
            >
              {isLoading? '🔄 Signing in...':'Sign In'}
            </button>

            {/* Info */}
            <p className="text-center text-xs sm:text-sm text-gray-700">
              Use your admin credentials
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
