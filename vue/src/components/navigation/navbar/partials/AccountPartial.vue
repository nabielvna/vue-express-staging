<template>
    <div class="relative">
        <!-- Guest View -->
        <RouterLink
            v-if="!authStore.isAuthenticated"
            to="/signin"
            class="text-gray-200 hover:text-white rounded-full hover:bg-white/10 p-3 hidden lg:block"
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
        </RouterLink>

        <!-- Authenticated User View -->
        <div v-else class="w-full h-full flex items-center justify-center">
            <!-- Profile Button -->
            <button
                @click="toggleDropdown"
                @blur="closeDropdown"
                class="focus:outline-none"
                type="button"
            >
                <div
                    class="w-11 h-11 rounded-full overflow-hidden border-2 border-gray-700 hover:border-white transition-colors duration-200"
                >
                    <!-- Profile Picture -->
                    <img
                        v-if="profilePictureUrl"
                        :src="profilePictureUrl"
                        :alt="userName"
                        class="w-full h-full object-cover"
                        @error="handleImageError"
                    />
                    <!-- Fallback Icon -->
                    <div
                        v-else
                        class="w-full h-full flex items-center justify-center bg-gray-800 text-gray-200 hover:text-white"
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
                    </div>
                </div>
            </button>

            <!-- Dropdown Menu -->
            <div
                v-show="isOpen"
                class="absolute right-0 mt-2 w-48 bg-black border border-gray-700 rounded-lg shadow-lg z-50"
            >
                <div
                    class="p-4 border-b border-gray-700 flex items-center space-x-3"
                >
                    <!-- Small Profile Picture in Dropdown -->
                    <div
                        class="w-10 h-10 rounded-full overflow-hidden border border-gray-700"
                    >
                        <img
                            v-if="profilePictureUrl"
                            :src="profilePictureUrl"
                            :alt="userName"
                            class="w-full h-full object-cover"
                            @error="handleImageError"
                        />
                        <div
                            v-else
                            class="w-full h-full flex items-center justify-center bg-gray-800"
                        >
                            <svg
                                class="w-5 h-5 text-gray-400"
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
                    <div>
                        <p class="text-sm text-white font-medium">
                            {{ userName }}
                        </p>
                        <p class="text-xs text-gray-400">
                            {{ authStore.user?.user?.email }}
                        </p>
                    </div>
                </div>

                <RouterLink
                    to="/account/profile"
                    class="px-4 py-2 text-sm text-gray-200 hover:bg-white/10 flex items-center"
                    @click="closeDropdown"
                >
                    <svg
                        class="w-4 h-4 mr-2"
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
                    Profile
                </RouterLink>

                <button
                    @click="handleLogout"
                    class="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-white/10 flex items-center"
                >
                    <svg
                        class="w-4 h-4 mr-2"
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
                    Logout
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const isOpen = ref(false)
const hasImageError = ref(false)
const BASE_API_URL = import.meta.env.VITE_BASE_API_URL.split('/api/v1')[0]

// Ubah jadi computed property agar reaktif
const profilePictureUrl = computed(() => {
    if (hasImageError.value) return null

    return authStore.user?.user?.profile_picture_url
        ? `${BASE_API_URL}/${authStore.user?.user?.profile_picture_url}`
        : null
})

// Computed property for user's display name
const userName = computed(() => {
    const user = authStore.user?.user
    return user?.nickname || user?.name || 'User'
})

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

// Untuk debug
onMounted(async () => {
    // Pastikan data user sudah ter-load
    if (!authStore.user) {
        try {
            // Asumsikan ada method getCurrentUser di authStore
            await authStore.getCurrentUser()
        } catch (error) {
            console.error('Failed to load user data:', error)
        }
    }

    console.log('Auth Store User:', authStore.user)
    console.log('Profile Picture URL:', profilePictureUrl.value)
})

const handleLogout = async () => {
    try {
        await authStore.logout()
        closeDropdown()
    } catch (error) {
        console.error('Logout failed:', error)
    }
}
</script>
