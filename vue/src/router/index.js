import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WishlistView from '@/views/WishlistView.vue'
import { authGuard } from './guard'
import { ProductGrid, ProductDetail, Catalog } from '@/views/product'

import { SignInView, SignUpView, ForgotPasswordView } from '../views/auth'

import AddressView from '@/views/account/AddressView.vue'
import AccountLayout from '@/views/layout/AccountLayout.vue'
import ProfileView from '@/views/account/ProfileView.vue'

const staticRoutes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
    },
    {
        path: '/wishlist',
        name: 'wishlist',
        component: WishlistView,
    },
    {
        path: '/signin',
        name: 'signin',
        component: SignInView,
    },
    {
        path: '/signup',
        name: 'signup',
        component: SignUpView,
    },
    {
        path: '/account',
        name: 'account',
        component: AccountLayout,
        children: [
            {
                path: 'profile',
                name: 'profile',
                component: ProfileView,
            },
            {
                path: 'address',
                name: 'address',
                component: AddressView,
            },
            {
                path: '',
                redirect: { name: 'profile' },
            },
        ],
    },
    {
        path: '/forgot-password',
        name: 'forgot-password',
        component: ForgotPasswordView,
    },
]

// Dynamic routes for collections and categories
const dynamicRoutes = [
    // Collections routes
    {
        path: '/collections',
        name: 'collections',
        component: Catalog,
        props: {
            type: 'collections',
        },
    },
    {
        path: '/collections/:path',
        name: 'collection-detail',
        component: ProductGrid,
        props: route => ({
            type: 'collections',
            path: route.params.path,
        }),
    },

    // Categories routes
    {
        path: '/categories',
        name: 'categories',
        component: Catalog,
        props: {
            type: 'categories',
        },
    },
    {
        path: '/categories/:path',
        name: 'category-detail',
        component: ProductGrid,
        props: route => ({
            type: 'categories',
            path: route.params.path,
        }),
    },
    {
        path: '/product/:id',
        name: 'product-detail',
        component: ProductDetail,
        props: true,
    },

    // Explore routes
    // {
    //     path: '/explore',
    //     name: 'explore',
    //     component: () => import('@/views/explore/IndexView.vue'),
    // },
    // {
    //     path: '/explore/new-arrivals',
    //     name: 'new-arrivals',
    //     component: () => import('@/views/explore/new-arrivals/IndexView.vue'),
    // },
    // {
    //     path: '/explore/bestsellers',
    //     name: 'bestsellers',
    //     component: () => import('@/views/explore/bestsellers/IndexView.vue'),
    // },
    // {
    //     path: '/explore/trending',
    //     name: 'trending',
    //     component: () => import('@/views/explore/trending/IndexView.vue'),
    // },
    // {
    //     path: '/explore/sale',
    //     name: 'sale',
    //     component: () => import('@/views/explore/sale/IndexView.vue'),
    // },
]

// Create router instance
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [...staticRoutes, ...dynamicRoutes],
})

router.beforeEach(authGuard)

export default router
