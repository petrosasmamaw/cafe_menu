import React from 'react'

export default function AdminNavbar({ page = 'dashboard', onGoHome, onGoDashboard, onGoComments }){
  function go(path){
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  function handleThemeToggle(){
    const el = document.documentElement
    if(el.classList.contains('dark')){
      el.classList.remove('dark')
      localStorage.setItem('theme','light')
    }else{
      el.classList.add('dark')
      localStorage.setItem('theme','dark')
    }
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-[#e8e4de] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={()=>{ (onGoHome || (()=>go('/')) )() }} className="text-[#6b3e26] text-sm hover:opacity-80">
              Back to home
            </button>
            <h1 className="text-lg sm:text-xl font-medium text-[#1a1a1a]">{page==='dashboard' ? 'LOL Admin Dashboard' : 'Comments'}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {page !== 'dashboard' && (
                <button onClick={()=>{ (onGoDashboard || (()=>go('/admin')))() }} className="bg-[#c77e3a] text-white rounded-lg px-3 py-2 text-sm font-medium hover:opacity-90 transition-opacity">
                  Dashboard
                </button>
              )}
              {page !== 'comments' && (
                <button onClick={()=>{ (onGoComments || (()=>go('/admin/comments')))() }} className="bg-white border border-[#e8e4de] text-[#374151] rounded-lg px-3 py-2 text-sm font-medium hover:opacity-90 transition-opacity">
                  Comments
                </button>
              )}
            </div>

            {/* Theme box */}
            <div className="flex items-center gap-2 border border-[#e8e4de] rounded-lg px-3 py-1 bg-[#fff]">
              <button onClick={handleThemeToggle} className="text-sm text-[#6b3e26]">Toggle Theme</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
