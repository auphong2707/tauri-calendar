import { configureStore } from '@reduxjs/toolkit'
import sidebarToggleReducer from '../features/sidebar/sidebarToggleSlice'

export default configureStore({
  reducer: {
    sidebarToggle: sidebarToggleReducer,
  }
})