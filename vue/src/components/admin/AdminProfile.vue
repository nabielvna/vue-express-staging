<template>
    <div class="relative">
        <button
            @click="toggleDropdown"
            @blur="closeDropdown"
            class="flex items-center space-x-3 p-2 rounded-lg hover:bg-zinc-800/50 transition-all duration-200 group"
        >
            <!-- Profile Picture/Avatar -->
            <div v-if="profilePictureUrl && !hasImageError" class="w-10 h-10">
                <img
                    :src="profilePictureUrl"
                    :alt="userName"
                    class="w-full h-full object-cover rounded-lg"
                    @error="handleImageError"
                />
            </div>
            <div
                v-else
                class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white font-bold group-hover:from-purple-500 group-hover:to-purple-700 transition-all duration-200"
            >
                {{ userInitials }}
            </div>

            <!-- User Info -->
            <div class="text-left">
                <p
                    class="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors duration-200"
                >
                    {{ userName }}
                </p>
                <p class="text-xs text-zinc-400">
                    {{ authStore.user?.user?.email }}
                </p>
            </div>
        </button>

        <!-- Dropdown Menu -->
        <div
            v-show="isOpen"
            class="absolute right-0 mt-2 w-48 bg-zinc-900 rounded-lg shadow-xl border border-zinc-800 py-1 z-50"
        >
            <!-- User Info Section -->
            <div class="px-4 py-3 border-b border-zinc-800">
                <p class="text-sm text-white font-medium">{{ userName }}</p>
                <p class="text-xs text-zinc-400">
                    {{ authStore.user?.user?.email }}
                </p>
            </div>

            <!-- View Store Link -->
            <RouterLink
                to="/"
                class="flex items-center px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors duration-200"
                @click="closeDropdown"
            >
                <svg
                    class="w-4 h-4 mr-2 text-zinc-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
                View Store
            </RouterLink>

            <!-- Profile Link -->
            <RouterLink
                to="/account/profile"
                class="flex items-center px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors duration-200"
                @click="closeDropdown"
            >
                <svg
                    class="w-4 h-4 mr-2 text-zinc-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                </svg>
                Profile
            </RouterLink>

            <!-- Transaction Link -->
            <RouterLink
                to="/transaction"
                class="flex items-center px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors duration-200"
                @click="closeDropdown"
            >
                <svg
                    class="w-4 h-4 mr-2 text-zinc-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                </svg>
                Transaction
            </RouterLink>

            <div class="border-t border-zinc-800 my-1"></div>

            <!-- Logout Button -->
            <button
                @click="handleLogout"
                class="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 transition-colors duration-200"
            >
                <svg
                    class="w-4 h-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                </svg>
                Logout
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const isOpen = ref(false)
const hasImageError = ref(false)
const BASE_API_URL = import.meta.env.VITE_BASE_API_URL.split('/api/v1')[0]

// Computed Properties
const profilePictureUrl = computed(() => {
    if (hasImageError.value) return null

    return authStore.user?.user?.profile_picture_url
        ? `${BASE_API_URL}/${authStore.user?.user?.profile_picture_url}`
        : null
})

const userName = computed(() => {
    const user = authStore.user?.user
    return user?.nickname || user?.name || 'User'
})

const userInitials = computed(() => {
    if (!authStore.user?.user?.name) return ''
    return authStore.user.user.name
        .split(' ')
        .map(name => name[0])
        .join('')
})

// Event Handlers
const handleImageError = () => {
    hasImageError.value = true
}

const toggleDropdown = () => {
    isOpen.value = !isOpen.value
}

const closeDropdown = () => {
    setTimeout(() => {
        isOpen.value = false
    }, 200)
}

const handleLogout = async () => {
    try {
        await authStore.logout()
        closeDropdown()
    } catch (error) {
        console.error('Logout failed:', error)
    }
}
</script>
