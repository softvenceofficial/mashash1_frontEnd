import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from './api'
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, persistReducer, persistStore } from 'redux-persist';
import authReducer from './slices/authSlice';
import dialogReducer from './slices/dialogSlice';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'userInfo',
  storage,
};
const persistedUserInfoReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedUserInfoReducer,
    dialog: dialogReducer,
    [baseApi.reducerPath]: baseApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(baseApi.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export const persistor = persistStore(store);