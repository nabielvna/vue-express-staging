import { useAuthStore } from '@/stores/authStore'

export const authGuard = async (to, from, next) => {
    const authStore = useAuthStore()
    const publicPages = ['/signin', '/signup', '/forgot-password']
    const protectedPages = ['/wishlist'] // Pindahkan /account ke logika terpisah
    const isAuthPage = publicPages.includes(to.path)

    // Fungsi untuk cek protected page dengan pattern matching
    const isProtectedPage = path => {
        // Cek exact matches dari protectedPages array
        if (protectedPages.includes(path)) return true

        // Cek apakah path dimulai dengan /account
        return path === '/account' || path.startsWith('/account/')
    }

    try {
        // Ensure auth is initialized
        if (!authStore.initialized) {
            await authStore.initializeAuth()
        }

        // If token exists but no user, try to get user data
        if (authStore.accessToken && !authStore.user) {
            try {
                await authStore.checkAuth()
            } catch (error) {
                console.error('Token validation failed:', error)
                authStore.clearAuth()
                if (!isAuthPage) {
                    next('/signin')
                    return
                }
            }
        }

        // After initialization, handle routing
        if (authStore.isAuthenticated) {
            if (isAuthPage) {
                next('/')
                return
            }
            next()
            return
        }

        // Not authenticated
        if (isProtectedPage(to.path)) {
            // Gunakan fungsi baru
            next('/signin')
            return
        }

        next()
    } catch (error) {
        console.error('Navigation guard error:', error)
        authStore.clearAuth()
        if (!isAuthPage) {
            next('/signin')
            return
        }
        next()
    }
}
