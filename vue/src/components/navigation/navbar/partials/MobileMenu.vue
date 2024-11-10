<template>
    <div class="lg:hidden">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center py-4">
            <div
                class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"
            ></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-red-500 text-center py-4">
            {{ error }}
        </div>

        <template v-else>
            <!-- Hamburger Button -->
            <button
                @click="isOpen = !isOpen"
                class="relative z-50 p-2 text-gray-300 hover:text-white transition-colors duration-200"
                aria-label="Toggle mobile menu"
            >
                <div class="w-6 h-6 relative">
                    <span
                        class="absolute h-0.5 w-full bg-current transform transition-all duration-300 ease-in-out"
                        :class="isOpen ? 'rotate-45 top-3' : 'top-1'"
                    ></span>
                    <span
                        class="absolute h-0.5 w-full bg-current transform transition-all duration-300 ease-in-out top-3"
                        :class="isOpen ? 'opacity-0' : 'opacity-100'"
                    ></span>
                    <span
                        class="absolute h-0.5 w-full bg-current transform transition-all duration-300 ease-in-out"
                        :class="isOpen ? '-rotate-45 top-3' : 'top-5'"
                    ></span>
                </div>
            </button>

            <!-- Mobile Menu Overlay -->
            <div
                class="fixed inset-0 bg-opacity-0 backdrop-blur-sm transition-all duration-300 z-10"
                :class="[isOpen ? 'visible bg-opacity-50' : 'invisible']"
                @click.self="isOpen = false"
            >
                <div
                    class="fixed top-0 right-0 w-full h-full max-w-md bg-black/95 shadow-2xl transform transition-transform duration-300 ease-out px-4"
                    :class="[isOpen ? 'translate-x-0' : 'translate-x-full']"
                >
                    <!-- Menu Container -->
                    <div class="h-full flex flex-col">
                        <!-- Header with Search -->
                        <div class="p-4 border-b border-white/10">
                            <div class="flex justify-between items-center mb-4">
                                <Logo />
                                <button
                                    @click="isOpen = false"
                                    class="p-2 text-white/80 hover:text-white"
                                >
                                    <svg
                                        class="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <!-- Search Bar -->
                            <div class="relative">
                                <input
                                    v-model="searchQuery"
                                    type="text"
                                    placeholder="Search products..."
                                    class="w-full bg-white/5 text-white placeholder-gray-400 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-1 focus:ring-white/20"
                                />
                                <svg
                                    class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                        </div>

                        <!-- Navigation -->
                        <div class="flex-1 overflow-y-auto">
                            <nav class="p-4 space-y-6">
                                <!-- Main Menu Items -->
                                <div
                                    v-for="menu in menus"
                                    :key="menu.id"
                                    class="relative"
                                >
                                    <div class="group">
                                        <div
                                            class="flex items-center justify-between"
                                        >
                                            <RouterLink
                                                :to="menu.path"
                                                class="text-white text-lg font-medium tracking-wide py-2 transition-colors duration-200"
                                                @click="isOpen = false"
                                            >
                                                {{ menu.label }}
                                            </RouterLink>
                                            <button
                                                v-if="menu.items?.length"
                                                @click="toggleSubmenu(menu.id)"
                                                class="p-2 text-white transition-colors duration-200"
                                            >
                                                <svg
                                                    class="w-5 h-5 transform transition-transform duration-200"
                                                    :class="{
                                                        'rotate-180':
                                                            activeSubmenu ===
                                                            menu.id,
                                                    }"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                            </button>
                                        </div>

                                        <!-- Submenu -->
                                        <div
                                            v-if="menu.items?.length"
                                            class="overflow-hidden transition-all duration-300 ease-in-out"
                                            :class="[
                                                activeSubmenu === menu.id
                                                    ? 'max-h-96'
                                                    : 'max-h-0',
                                            ]"
                                        >
                                            <div
                                                class="pl-4 mt-2 space-y-2 border-l border-gray-700"
                                            >
                                                <RouterLink
                                                    v-for="item in menu.items"
                                                    :key="item.id"
                                                    :to="item.path"
                                                    class="block text-gray-300 py-2 text-base transition-colors duration-200"
                                                    @click="isOpen = false"
                                                >
                                                    {{ item.label }}
                                                </RouterLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </nav>
                        </div>

                        <!-- Footer Actions -->
                        <div class="border-t border-white/10 p-4 space-y-4">
                            <!-- Wishlist Link -->
                            <RouterLink
                                to="/wishlist"
                                class="flex items-center space-x-3 text-gray-300 hover:text-white py-2"
                                @click="isOpen = false"
                            >
                                <svg
                                    class="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                                <span>Wishlist</span>
                                <span
                                    v-if="wishlistCount > 0"
                                    class="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-auto"
                                >
                                    {{ wishlistCount }}
                                </span>
                            </RouterLink>

                            <!-- Account Section -->
                            <template v-if="!authStore.isAuthenticated">
                                <RouterLink
                                    to="/signin"
                                    class="flex items-center space-x-3 text-gray-300 hover:text-white py-2"
                                    @click="isOpen = false"
                                >
                                    <svg
                                        class="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    <span>Sign In</span>
                                </RouterLink>
                            </template>
                            <template v-else>
                                <!-- Profile Link -->
                                <RouterLink
                                    to="/account/profile"
                                    class="flex items-center space-x-3 text-gray-300 hover:text-white py-2"
                                    @click="isOpen = false"
                                >
                                    <div
                                        class="w-8 h-8 rounded-full overflow-hidden border border-gray-700"
                                    >
                                        <img
                                            v-if="
                                                authStore.user?.user
                                                    ?.profile_picture_url
                                            "
                                            :src="`${baseApiUrl}/${authStore.user.user.profile_picture_url}`"
                                            :alt="userName"
                                            class="w-full h-full object-cover"
                                            @error="handleImageError"
                                        />
                                        <div
                                            v-else
                                            class="w-full h-full flex items-center justify-center bg-gray-800 text-gray-200"
                                        >
                                            <svg
                                                class="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <div class="flex-1">
                                        <p
                                            class="text-sm font-medium text-white"
                                        >
                                            {{ userName }}
                                        </p>
                                        <p class="text-xs text-gray-400">
                                            {{ authStore.user?.user?.email }}
                                        </p>
                                    </div>
                                </RouterLink>

                                <!-- Logout Button -->
                                <button
                                    @click="handleLogout"
                                    class="w-full flex items-center space-x-3 text-red-500 hover:text-red-400 py-2"
                                >
                                    <svg
                                        class="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                        />
                                    </svg>
                                    <span>Logout</span>
                                </button>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useMenuData } from '@/composables/useMenuData'
import { useAuthStore } from '@/stores/authStore'
import { Logo } from '.'

// Store and router
const authStore = useAuthStore()
const router = useRouter()

// Environment variables
const baseApiUrl = import.meta.env.VITE_BASE_API_URL.split('/api/v1')[0]

// Use menu data composable
const { menuConfig, isLoading, error, refreshMenuData } = useMenuData()

// Reactive state
const isOpen = ref(false)
const activeSubmenu = ref(null)
const searchQuery = ref('')
const wishlistCount = ref(0)
const hasImageError = ref(false)

// Computed
const menus = computed(() => menuConfig.value)
const userName = computed(() => {
    const user = authStore.user?.user
    return user?.nickname || user?.name || 'User'
})

// Methods
const toggleSubmenu = menuId => {
    activeSubmenu.value = activeSubmenu.value === menuId ? null : menuId
}

const handleImageError = () => {
    hasImageError.value = true
}

const handleLogout = async () => {
    try {
        await authStore.logout()
        isOpen.value = false
        router.push('/')
    } catch (error) {
        console.error('Logout failed:', error)
    }
}

// Reset mobile menu state on route change
router.afterEach(() => {
    isOpen.value = false
    activeSubmenu.value = null
})

// Method to manually refresh menu data
const handleRefreshMenu = async () => {
    await refreshMenuData()
}

// Expose necessary properties
defineExpose({
    isOpen,
    refreshMenuData: handleRefreshMenu,
})
</script>
