import React from 'react'
import { useGetCommentsQuery } from '../store/api/commentsApi'

export default function AdminComments(){
  const { data, isLoading, isFetching } = useGetCommentsQuery()
  const comments = data?.comments || []

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <header className="bg-white border-b border-[#e8e4de] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a href="/admin" className="text-[#6b3e26] text-sm hover:opacity-80 flex items-center gap-1">Back</a>
              <h1 className="text-lg sm:text-xl font-medium text-[#1a1a1a]">Comments</h1>
            </div>
          </div>
        </div>
      </header>

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
