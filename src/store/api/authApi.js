import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const rawApiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4002/api'
const apiBase = rawApiBase.endsWith('/api') ? rawApiBase : rawApiBase.replace(/\/$/, '') + '/api'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiBase, credentials: 'include' }),
  endpoints: (build) => ({
    login: build.mutation({
      query: (creds) => ({ url: '/auth/login', method: 'POST', body: creds }),
    }),
    register: build.mutation({
      query: (creds) => ({ url: '/auth/register', method: 'POST', body: creds }),
    }),
    logout: build.mutation({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),
    getMe: build.query({
      query: () => ({ url: '/auth/me', method: 'GET' }),
    }),
  }),
})

export const { useLoginMutation, useRegisterMutation, useLogoutMutation, useGetMeQuery } = authApi
