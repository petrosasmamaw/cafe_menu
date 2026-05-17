import React from 'react'
import { useGetCommentsQuery } from '../store/api/commentsApi'
import AdminNavbar from '../components/AdminNavbar'

export default function AdminComments(){
  const { data, isLoading, isFetching } = useGetCommentsQuery()
  const comments = data?.comments || []

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <AdminNavbar page="comments" onGoDashboard={() => { window.history.pushState({}, '', '/admin'); window.dispatchEvent(new PopStateEvent('popstate')) }} onGoHome={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')) }} />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
        {isLoading || isFetching ? (
          <p className="text-gray-400">Loading...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-400">No comments yet</p>
        ) : (
          <div className="grid gap-3">
            {comments.map(c => (
              <div key={c.id} className="bg-white border border-[#e8e4de] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-[#1a1a1a]">{c.name || 'Anonymous'}</div>
                  <div className="text-xs text-gray-400">{new Date(c.created_at).toLocaleString()}</div>
                </div>
                <div className="text-sm text-[#374151]">{c.comment}</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
