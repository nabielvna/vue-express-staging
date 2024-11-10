import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from './guard'

// layouts
import AppLayout from '@/views/layout/AppLayout.vue'
import AccountLayout from '@/views/layout/AccountLayout.vue'
import AdminLayout from '@/views/layout/AdminLayout.vue'
// View
import HomeView from '@/views/HomeView.vue'

import { SignInView, SignUpView, ForgotPasswordView } from '@/views/auth'

import {
    ProductGrid,
    ProductDetail,
    Catalog,
    Wishlist,
    Cart,
    Checkout,
    Transaction,
    TransactionDetail,
} from '@/views/product'

import ProfileView from '@/views/account/ProfileView.vue'
import AddressView from '@/views/account/AddressView.vue'
import {
    AdminCatalog,
    AdminCatalogDetail,
    Dashboard,
    Orders,
    Products,
    Roles,
    Users,
} from '@/components/admin'

const normalRoutes = [
    {
        path: '/',
        name: 'app',
        component: AppLayout,
        children: [
            {
                path: '/',
                name: 'home',
                component: HomeView,
            },
            {
                path: '/wishlist',
                name: 'wishlist',
                component: Wishlist,
            },
            {
                path: '/cart',
                name: 'cart',
                component: Cart,
            },
            {
                path: '/checkout',
                name: 'checkout',
                component: Checkout,
            },
            {
                path: '/transaction',
                name: 'transaction',
                component: Transaction,
            },
            {
                path: '/transaction/:id',
                name: 'transaction-detail',
                component: TransactionDetail,
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
            // dynamicRoutes
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
        ],
    },
]

const adminRoutes = [
    {
        path: '/admin',
        name: 'admin',
        component: AdminLayout,
        children: [
            {
                path: 'dashboard',
                name: 'admin-dashboard',
                component: Dashboard,
            },
            {
                path: 'orders',
                name: 'admin-orders',
                component: Orders,
            },
            {
                path: 'users',
                name: 'admin-users',
                component: Users,
            },
            {
                path: 'products',
                name: 'admin-products',
                component: Products,
            },
            // penerapan catalog disini
            {
                path: 'collections',
                name: 'admin-collections',
                component: AdminCatalog,
                props: {
                    type: 'collections',
                },
            },
            {
                path: 'categories',
                name: 'admin-categories',
                component: AdminCatalog,
                props: {
                    type: 'categories',
                },
            },
            {
                path: 'roles',
                name: 'admin-roles',
                component: Roles,
            },
            {
                path: '',
                redirect: '/admin/dashboard',
            },
            {
                path: 'collections/:path',
                name: 'admin-collection-detail',
                component: AdminCatalogDetail,
                props: route => ({
                    type: 'collections',
                    ...route.params,
                }),
            },
            {
                path: 'categories/:path',
                name: 'admin-category-detail',
                component: AdminCatalogDetail,
                props: route => ({
                    type: 'categories',
                    ...route.params,
                }),
            },
        ],
    },
]

// Create router instance
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [...normalRoutes, ...adminRoutes],
})

router.beforeEach(authGuard)

export default router
