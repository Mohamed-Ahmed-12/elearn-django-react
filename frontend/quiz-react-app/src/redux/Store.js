import { configureStore } from '@reduxjs/toolkit';
import axiosInstance from '../components/axiosInstance';
import authReducer ,  { logout, refreshAccessToken } from './slices/authSlice';
import quizReducer from './slices/quizSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    quiz: quizReducer,
  },
});


// Add a response interceptor to check after response if unauthorized must refresh token , to better UX
axiosInstance.interceptors.response.use(
  (response) => {
    // Do something with response data
    console.log("Response received:", response);
    return response;
  }, async (error) => {
    // console.log(error);
    if(store.getState().auth.token.access){
      const originalRequest = error.config;
    // console.log(originalRequest._retry);

    if (error.response?.status === 401 && !originalRequest._retry) {
      // If the request is not a retry, refresh the access token and retry the request
      originalRequest._retry = true;
      try {
        // Update Redux store
        const resultAction = await store.dispatch(refreshAccessToken());

        if (refreshAccessToken.fulfilled.match(resultAction)) {
          // If the action is fulfilled, it means the token was refreshed successfully
          // So, we can retry the original request with the new token
          // Retry original request with new token
          const newAccess = store.getState().auth.token.access
          originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;

          return axiosInstance(originalRequest);

        } else{
          store.dispatch(logout());

        }

      } catch (err) {
        // Handle refresh token failure (e.g., logout)
        store.dispatch(logout());
      }
    }
    } 
    
    return Promise.reject(error);
});



/*
to get state 
store.getState();
{
  auth: {initial state in auth slice},
  quiz: {initial state in quiz slice},
}
*/
export default store;
