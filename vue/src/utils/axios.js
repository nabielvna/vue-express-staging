import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

// Flag untuk mencegah multiple refresh requests
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    failedQueue = []
}

// Request interceptor
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error => {
        return Promise.reject(error)
    },
)

// Response interceptor
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config

        // Prevent retrying refresh token endpoint
        if (originalRequest.url === '/auth/refresh') {
            const authStore = useAuthStore()
            await authStore.handleTokenRevocation()
            return Promise.reject(error)
        }

        // Handle revoked token
        if (error.response?.data?.code === 'TOKEN_REVOKED') {
            const authStore = useAuthStore()
            await authStore.handleTokenRevocation()
            return Promise.reject(error)
        }

        // Handle expired/invalid token
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Queue the request if refresh is in progress
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`
                        return axiosInstance(originalRequest)
                    })
                    .catch(err => Promise.reject(err))
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                const response = await axiosInstance.post('/auth/refresh')
                const { accessToken } = response.data.data

                localStorage.setItem('accessToken', accessToken)
                originalRequest.headers.Authorization = `Bearer ${accessToken}`

                processQueue(null, accessToken)
                return axiosInstance(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError, null)
                const authStore = useAuthStore()
                await authStore.handleTokenRevocation()
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    },
)

export default axiosInstance
