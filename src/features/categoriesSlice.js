import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchCategories = createAsyncThunk('categories/fetch', async () => {
  const res = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
  const data = await res.json()
  return data.categories || []
})

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const selectCategories = (state) => state.categories

export default categoriesSlice.reducer
