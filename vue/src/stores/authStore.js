import { defineStore } from 'pinia'
import { authApi } from '../services/authService'
import router from '../router'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        accessToken: localStorage.getItem('accessToken') || null,
        loading: false,
        error: null,
        initialized: false,
    }),

    getters: {
        isAuthenticated: state => !!state.accessToken && !!state.user,
        currentUser: state => state.user,
        authError: state => state.error,
        profilePictureUrl: state => {
            const baseUrl = import.meta.env.VITE_BASE_API_URL.split(
                '/api/v1',
            )[0]
            return state.user?.user?.profile_picture_url
                ? `${baseUrl}/${state.user.user.profile_picture_url}`
                : null
        },
    },

    actions: {
        async initializeAuth() {
            if (this.initialized) return

            try {
                const token = localStorage.getItem('accessToken')
                if (!token) {
                    this.initialized = true
                    return
                }

                this.accessToken = token
                await this.checkAuth()
            } catch (error) {
                console.error('Auth initialization error:', error)
                this.clearAuth()
            } finally {
                this.initialized = true
            }
        },

        setError(error) {
            this.error = error
        },

        clearError() {
            this.error = null
        },

        setUser(userData) {
            // Pastikan struktur data sesuai
            if (userData && !userData.user && typeof userData === 'object') {
                // Jika userData langsung berisi user data tanpa nesting
                this.user = { user: userData }
            } else {
                // Jika sudah dalam format yang benar (nested dengan user property)
                this.user = userData
            }
        },

        setToken(token) {
            this.accessToken = token
            if (token) {
                localStorage.setItem('accessToken', token)
            } else {
                localStorage.removeItem('accessToken')
            }
        },

        clearAuth() {
            this.user = null
            this.setToken(null)
            this.initialized = false

            // Clear all auth related cookies
            document.cookie.split(';').forEach(cookie => {
                document.cookie = cookie
                    .replace(/^ +/, '')
                    .replace(
                        /=.*/,
                        '=;expires=' + new Date().toUTCString() + ';path=/',
                    )
            })
        },

        async handleTokenRevocation() {
            try {
                this.clearAuth()
                router.push('/signin')
            } catch (error) {
                console.error('Error handling token revocation:', error)
            }
        },

        async checkAuth() {
            try {
                if (!this.accessToken) {
                    throw new Error('No access token')
                }

                const response = await authApi.getCurrentUser()

                if (
                    response?.data?.status === 'success' &&
                    response?.data?.data
                ) {
                    this.setUser(response.data.data)
                    return response.data.data
                }

                console.error('Unexpected response structure:', response.data)
                throw new Error('Invalid response structure')
            } catch (error) {
                console.error('Check auth error:', error)
                this.clearAuth()
                throw error
            }
        },

        async signup(userData) {
            try {
                this.loading = true
                this.clearError()

                const response = await authApi.signup(userData)

                if (
                    response?.data?.status === 'success' &&
                    response?.data?.data?.accessToken
                ) {
                    this.setToken(response.data.data.accessToken)
                    this.setUser(response.data.data.user)

                    // Wait for user data to be set
                    await new Promise(resolve => setTimeout(resolve, 100))
                    router.push('/')
                    return response
                } else {
                    throw new Error('Invalid response format')
                }
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message ||
                    error.message ||
                    'Sign up failed. Please try again.'
                this.setError(errorMessage)
                throw error
            } finally {
                this.loading = false
            }
        },

        async signin(credentials) {
            try {
                this.loading = true
                this.clearError()

                const response = await authApi.signin(credentials)

                if (
                    response?.data?.status === 'success' &&
                    response?.data?.data?.accessToken
                ) {
                    this.setToken(response.data.data.accessToken)

                    if (response.data.data.user) {
                        const userData = {
                            user: response.data.data.user,
                        }
                        this.setUser(userData)
                    } else {
                        await this.checkAuth()
                    }

                    // Wait for user data to be properly set
                    await new Promise(resolve => setTimeout(resolve, 100))
                    router.push('/')
                    return response
                } else {
                    console.error('Invalid response format:', response)
                    throw new Error('Invalid response format')
                }
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message ||
                    'Sign in failed. Please try again.'
                this.setError(errorMessage)
                throw error
            } finally {
                this.loading = false
            }
        },

        async logout() {
            try {
                if (this.accessToken) {
                    await authApi.logout()
                }
            } catch (error) {
                console.error('Logout error:', error)
            } finally {
                this.clearAuth()
                router.push('/signin')
            }
        },
    },
})
