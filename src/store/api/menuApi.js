import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4002/api'

export const menuApi = createApi({
  reducerPath: 'menuApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiBase, credentials: 'include' }),
  tagTypes: ['Menu'],
  endpoints: (build) => ({
    getMenu: build.query({
      query: () => '/menu',
      providesTags: (result) => {
        const items = Array.isArray(result?.menu) ? result.menu : []
        return [
          ...items.map(({ id }) => ({ type: 'Menu', id })),
          { type: 'Menu', id: 'LIST' },
        ]
      },
    }),
    addMenuItem: build.mutation({
      query: (body) => ({ url: '/menu', method: 'POST', body }),
      invalidatesTags: [{ type: 'Menu', id: 'LIST' }],
    }),
    updateMenuItem: build.mutation({
      query: ({ id, ...patch }) => ({ url: `/menu/${id}`, method: 'PUT', body: patch }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Menu', id }],
    }),
    deleteMenuItem: build.mutation({
      query: (id) => ({ url: `/menu/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'Menu', id }, { type: 'Menu', id: 'LIST' }],
    }),
  }),
})

export const { useGetMenuQuery, useAddMenuItemMutation, useUpdateMenuItemMutation, useDeleteMenuItemMutation } = menuApi
