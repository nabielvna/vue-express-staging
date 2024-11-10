import { useAuthStore } from '@/stores/authStore'

export const authGuard = async (to, from, next) => {
    const authStore = useAuthStore()

    // Define route groups with consistent naming
    const authOnlyRoutes = ['/signin', '/signup', '/forgot-password']
    const userOnlyRoutes = ['/wishlist', '/cart', '/account', '/transaction']
    const adminOnlyRoutes = ['/admin']
    const publicPaths = {
        exact: ['/', '/collections', '/categories'],
        startsWith: ['/collections/', '/categories/', '/product/'],
    }

    // Helper functions untuk cek route access
    const isAuthOnlyRoute = path => authOnlyRoutes.includes(path)

    const isUserOnlyRoute = path => {
        return userOnlyRoutes.includes(path) || path.startsWith('/account/')
    }

    const isAdminOnlyRoute = path => {
        return adminOnlyRoutes.includes(path) || path.startsWith('/admin/')
    }

    const isPublicRoute = path => {
        // Check exact matches first
        if (publicPaths.exact.includes(path)) return true

        // Check paths that start with certain prefixes
        return publicPaths.startsWith.some(prefix => path.startsWith(prefix))
    }

    try {
        // Route yang membutuhkan auth hanya user-only dan admin-only routes
        const requiresAuth =
            isUserOnlyRoute(to.path) || isAdminOnlyRoute(to.path)

        // Initialize auth only if needed
        if (requiresAuth && !authStore.initialized) {
            await authStore.initializeAuth()
        }

        // Validate existing token only for routes that require auth
        if (requiresAuth && authStore.accessToken && !authStore.user) {
            try {
                await authStore.checkAuth()
            } catch (error) {
                console.error('Token validation failed:', error)
                authStore.clearAuth()
                if (!isAuthOnlyRoute(to.path)) {
                    next('/signin')
                    return
                }
            }
        }

        // Route access control logic
        if (authStore.isAuthenticated) {
            // Authenticated users shouldn't access auth routes
            if (isAuthOnlyRoute(to.path)) {
                next('/')
                return
            }

            // Admin only routes check
            if (isAdminOnlyRoute(to.path)) {
                if (
                    authStore.user?.user?.Role?.name !== 'admin' &&
                    authStore.user?.user?.Role?.name !== 'superadmin'
                ) {
                    next('/')
                    return
                }
            }

            next()
            return
        }

        // Non-authenticated users access control
        if (isUserOnlyRoute(to.path) || isAdminOnlyRoute(to.path)) {
            next('/signin')
            return
        }

        // Jika route adalah auth route atau public route, izinkan akses
        if (isAuthOnlyRoute(to.path) || isPublicRoute(to.path)) {
            next()
            return
        }

        // Default: redirect ke signin
        next('/signin')
    } catch (error) {
        console.error('Navigation guard error:', error)
        authStore.clearAuth()
        if (!isAuthOnlyRoute(to.path)) {
            next('/signin')
            return
        }
        next()
    }
}
