import React from 'react'
import { useGetCommentsQuery } from '../store/api/commentsApi'
import AdminNavbar from '../components/AdminNavbar'

export default function AdminComments(){
  const { data, isLoading, isFetching } = useGetCommentsQuery()
  const comments = data?.comments || []

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }
        .lol-root { min-height: 100vh; background: #faf7f2; background-image: radial-gradient(ellipse 70% 40% at 50% 0%, rgba(201,144,58,0.07) 0%, transparent 60%), radial-gradient(ellipse 50% 30% at 90% 10%, rgba(180,110,30,0.05) 0%, transparent 50%); }
        .lol-card { background: #ffffff; border: 1px solid #f0e8dc; border-radius: 16px; overflow: hidden; }
      `}</style>

      <div className="lol-root">
        <AdminNavbar page="comments" onGoDashboard={() => { window.history.pushState({}, '', '/admin'); window.dispatchEvent(new PopStateEvent('popstate')) }} onGoHome={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')) }} />

        <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 16px 64px' }}>
          {isLoading || isFetching ? (
            <p style={{ color: '#c4b8a8' }}>Loading...</p>
          ) : comments.length === 0 ? (
            <p style={{ color: '#c4b8a8' }}>No comments yet</p>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {comments.map(c => (
                <div key={c.id} className="lol-card" style={{ padding: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{c.name || 'Anonymous'}</div>
                    <div style={{ fontSize: 12, color: '#c4b8a8' }}>{new Date(c.created_at).toLocaleString()}</div>
                  </div>
                  <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{c.comment}</div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  )
}
