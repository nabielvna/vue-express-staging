<template>
    <div class="min-h-screen bg-black text-white">
        <header class="px-4 py-6 mt-16">
            <div class="max-w-[1200px] mx-auto relative">
                <h1
                    class="text-xl tracking-[0.2em] uppercase absolute -top-12 left-0 font-bold"
                >
                    Wishlist
                </h1>
                <!-- Top Line -->
                <div class="w-full h-[0.5px] bg-white"></div>

                <!-- Menu Button centered between lines -->
                <div class="absolute right-0" style="top: calc(50% - 10px)">
                    <div class="relative">
                        <button
                            @click="toggleDropdown"
                            class="text-white hover:text-gray-300 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <circle cx="12" cy="12" r="2" />
                                <circle cx="12" cy="5" r="2" />
                                <circle cx="12" cy="19" r="2" />
                            </svg>
                        </button>
                        <!-- Dropdown Menu -->
                        <div
                            v-if="isDropdownOpen"
                            class="absolute right-0 mt-4 w-60 bg-white"
                            @click.stop
                        >
                            <button
                                @click="clearWishlist"
                                class="w-full px-6 py-3 text-left text-sm text-black tracking-[0.2em] uppercase font-light"
                            >
                                Clear List
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Bottom Line -->
                <div class="w-full h-[0.5px] bg-white mt-12"></div>
            </div>
        </header>

        <main class="px-4 py-8">
            <div class="max-w-[1200px] mx-auto">
                <!-- Loading State -->
                <div
                    v-if="loading"
                    class="flex justify-center items-center h-[40vh]"
                >
                    <div
                        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"
                    ></div>
                </div>

                <!-- Empty State -->
                <div
                    v-else-if="!wishlistItems.length"
                    class="flex flex-col items-center justify-center h-[40vh]"
                >
                    <div class="text-center max-w-2xl mx-auto">
                        <h2 class="text-xl font-light tracking-[0.2em] mb-8">
                            Love It? Add To My Wishlist
                        </h2>
                        <p
                            class="text-sm text-gray-300 leading-relaxed mb-10 max-w-xl mx-auto tracking-[0.2em]"
                        >
                            My Wishlist allows you to keep track of all of your
                            favorites and shopping activity whether you're on
                            your computer, phone, or tablet.
                        </p>
                        <button
                            @click="goToDashboard"
                            class="bg-white text-black px-8 py-2 text-sm hover:bg-gray-100 transition-colors uppercase tracking-[0.2em]"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>

                <!-- Wishlist Items -->
                <div
                    v-else
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <div
                        v-for="item in wishlistItems"
                        :key="item.id"
                        class="group relative"
                    >
                        <!-- Image Container -->
                        <div class="relative w-full overflow-hidden">
                            <img
                                :src="getProductImage(item)"
                                :alt="item.name"
                                class="w-full h-auto object-cover aspect-[3/4]"
                            />

                            <!-- Overlay with details (visible on hover) -->
                            <div
                                class="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4"
                            >
                                <!-- Top section -->
                                <div
                                    class="space-y-2 transform translate-y-[-20px] group-hover:translate-y-0 transition-transform duration-300"
                                >
                                    <p class="text-gray-300">
                                        {{ item.category?.name }}
                                    </p>
                                    <p class="text-xl font-bold">
                                        {{
                                            new Intl.NumberFormat('id-ID', {
                                                style: 'currency',
                                                currency: 'IDR',
                                            }).format(item.price)
                                        }}
                                    </p>
                                </div>

                                <!-- Bottom section -->
                                <div
                                    class="space-y-2 transform translate-y-[20px] group-hover:translate-y-0 transition-transform duration-300"
                                >
                                    <button
                                        @click="viewProduct(item.id)"
                                        class="w-full bg-white text-black py-2 hover:bg-gray-100 transition-colors text-sm uppercase tracking-wider"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        @click="
                                            handleRemoveFromWishlist(item.id)
                                        "
                                        class="w-full bg-red-600 text-white py-2 hover:bg-red-700 transition-colors text-sm uppercase tracking-wider"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Product name (always visible) -->
                        <h3 class="text-lg font-bold mt-2">{{ item.name }}</h3>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { wishlistService } from '@/services/wishlistService'

const router = useRouter()
const wishlistItems = ref([])
const loading = ref(false)
const isDropdownOpen = ref(false)

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_BASE_API_URL
const BASE_URL = API_URL.split('/api/v1')[0]

// Get product image
const getProductImage = product => {
    if (product.ProductAssets && product.ProductAssets.length > 0) {
        const assetUrl = product.ProductAssets[0].asset_url
        if (assetUrl.startsWith('http')) {
            return assetUrl
        }
        return `${BASE_URL}/${assetUrl}`
    }
    return '/placeholder-image.jpg'
}

// Fetch wishlist items
const fetchWishlistItems = async () => {
    try {
        loading.value = true
        wishlistItems.value = await wishlistService.getWishlist()
    } catch (error) {
        console.error('Error fetching wishlist:', error)
    } finally {
        loading.value = false
    }
}

// Remove item from wishlist
const handleRemoveFromWishlist = async productId => {
    try {
        loading.value = true
        await wishlistService.removeFromWishlist(productId)
        wishlistItems.value = wishlistItems.value.filter(
            item => item.id !== productId,
        )
    } catch (error) {
        console.error('Error removing from wishlist:', error)
    } finally {
        loading.value = false
    }
}

// Clear entire wishlist
const clearWishlist = async () => {
    try {
        loading.value = true
        await wishlistService.clearWishlist()
        wishlistItems.value = []
        isDropdownOpen.value = false
    } catch (error) {
        console.error('Error clearing wishlist:', error)
    } finally {
        loading.value = false
    }
}

// Navigation functions
const goToDashboard = () => router.push('/')
const viewProduct = productId => router.push(`/product/${productId}`)

// Dropdown handling
const handleClickOutside = () => {
    if (isDropdownOpen.value) {
        isDropdownOpen.value = false
    }
}

const toggleDropdown = event => {
    event.stopPropagation()
    isDropdownOpen.value = !isDropdownOpen.value
}

// Lifecycle hooks
onMounted(() => {
    fetchWishlistItems()
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>
