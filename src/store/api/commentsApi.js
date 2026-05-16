import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const rawApiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4002/api'
const apiBase = rawApiBase.endsWith('/api') ? rawApiBase : rawApiBase.replace(/\/$/, '') + '/api'

export const commentsApi = createApi({
  reducerPath: 'commentsApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiBase, credentials: 'include' }),
  tagTypes: ['Comments'],
  endpoints: (build) => ({
    getComments: build.query({
      query: () => '/comments',
      providesTags: (result) => [
        { type: 'Comments', id: 'LIST' },
        ...(Array.isArray(result?.comments) ? result.comments.map(c => ({ type: 'Comments', id: c.id })) : []),
      ],
    }),
    addComment: build.mutation({
      query: (body) => ({ url: '/comments', method: 'POST', body }),
      invalidatesTags: [{ type: 'Comments', id: 'LIST' }],
    }),
  }),
})

export const { useGetCommentsQuery, useAddCommentMutation } = commentsApi
