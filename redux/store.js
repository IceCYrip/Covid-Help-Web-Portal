import { configureStore } from '@reduxjs/toolkit'
import { combineReducers, applyMiddleware } from 'redux'
import {
  persistStore,
  persistReducer,
  REHYDRATE,
  PERSIST,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import UserSlice from './slices/UserSlice'

const persistConfig = {
  key: 'user',
  version: 1,
  storage,
}

const rootReducer = combineReducers({
  user: UserSlice.reducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [REHYDRATE, PERSIST, REGISTER],
      },
    }),
})
const persistor = persistStore(store)

export default store
export { persistor }
