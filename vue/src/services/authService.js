import axiosInstance from '@/utils/axios'

export const authApi = {
    signup(data) {
        return axiosInstance.post('/auth/signup', data)
    },

    signin(credentials) {
        return axiosInstance.post('/auth/signin', credentials)
    },

    logout() {
        return axiosInstance.post('/auth/logout')
    },

    getCurrentUser() {
        return axiosInstance.get('/auth/me')
    },

    refreshToken() {
        return axiosInstance.post('/auth/refresh')
    },
}
