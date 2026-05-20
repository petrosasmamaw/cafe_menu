import React from 'react'

export default function AdminNavbar({ page = 'dashboard', onGoHome, onGoDashboard, onGoComments }){
  function go(path){
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <header className="lol-header" style={{ borderBottom: '1px solid rgba(201,144,58,0.15)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '14px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #c9903a, #a06820)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(201,144,58,0.3)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" /><line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" /></svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: '#1e0f04' }}>{page==='dashboard' ? 'LOL Admin Dashboard' : 'Comments'}</div>
              <div style={{ fontSize: 10, color: '#c4b8a8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Manage Menu</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {page !== 'dashboard' && (
              <button onClick={()=>{ (onGoDashboard || (()=>go('/admin')))() }} style={{ background: 'linear-gradient(135deg, #c9903a, #e8b86d)', border: 'none', color: '#fff', borderRadius: 20, padding: '7px 18px', fontSize: 12, fontWeight: 600 }}>Dashboard</button>
            )}
            {page !== 'comments' && (
              <button onClick={()=>{ (onGoComments || (()=>go('/admin/comments')))() }} style={{ background: '#f5f0e8', border: '1px solid #ede5d8', color: '#9a8878', borderRadius: 20, padding: '7px 16px', fontSize: 12 }}>Comments</button>
            )}
            <button onClick={()=>{ (onGoHome || (()=>go('/')))() }} style={{ background: 'transparent', border: '1px solid #ede5d8', color: '#374151', borderRadius: 20, padding: '7px 12px', fontSize: 12 }}>Back</button>
          </div>
        </div>
      </div>
    </header>
  )
}
