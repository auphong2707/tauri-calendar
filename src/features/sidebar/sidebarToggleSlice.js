import { createSlice } from '@reduxjs/toolkit'

export const sidebarToggleSlice = createSlice({
  name: 'sidebarToggle',
  initialState: {
    value: true,
  },
  reducers: {
    openSidebar: (state) => {
      state.value = true
    },
    closeSidebar: (state) => {
      state.value = false
    },
  },
})

// Action creators are generated for each case reducer function
export const { openSidebar, closeSidebar } = sidebarToggleSlice.actions

export default sidebarToggleSlice.reducer