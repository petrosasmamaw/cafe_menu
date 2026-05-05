import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchMealsByCategory = createAsyncThunk('meals/fetchByCategory', async (category) => {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`)
  const data = await res.json()
  return data.meals || []
})

export const searchMeals = createAsyncThunk('meals/search', async (query) => {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`)
  const data = await res.json()
  return data.meals || []
})

export const fetchMealById = createAsyncThunk('meals/fetchById', async (id) => {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
  const data = await res.json()
  return data.meals || null
})

export const fetchRandomMeal = createAsyncThunk('meals/random', async () => {
  const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
  const data = await res.json()
  return data.meals || null
})

const mealsSlice = createSlice({
  name: 'meals',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMealsByCategory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMealsByCategory.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchMealsByCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      .addCase(searchMeals.pending, (state) => {
        state.loading = true
      })
      .addCase(searchMeals.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(searchMeals.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      .addCase(fetchMealById.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchMealById.fulfilled, (state, action) => {
        state.loading = false
        // do not replace list; return payload for detail handling in component
      })
      .addCase(fetchMealById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      .addCase(fetchRandomMeal.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchRandomMeal.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(fetchRandomMeal.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const selectMeals = (state) => state.meals

export default mealsSlice.reducer
