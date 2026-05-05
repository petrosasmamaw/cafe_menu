import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import authReducer from './slices/authSlice'
import { menuApi } from './api/menuApi'
import { authApi } from './api/authApi'

const store = configureStore({
  reducer: {
    auth: authReducer,
    [menuApi.reducerPath]: menuApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(menuApi.middleware, authApi.middleware),
})

setupListeners(store.dispatch)
export default store
