<template>
    <div class="min-h-screen bg-black p-8">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center py-12">
            <div
                class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"
            ></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
            <p class="text-red-500">{{ error }}</p>
            <button
                @click="fetchProduct"
                class="mt-4 px-4 py-2 bg-white text-black hover:bg-gray-200 transition-colors duration-200 rounded"
            >
                Try Again
            </button>
        </div>

        <div v-else-if="product" class="max-w-[85rem] mx-auto">
            <!-- Breadcrumb -->
            <div class="text-white text-sm mb-8">
                <router-link to="/" class="hover:text-gray-300"
                    >Home</router-link
                >
                <span class="mx-2">/</span>
                <router-link
                    :to="`/collections/${product.Collection?.path}`"
                    class="hover:text-gray-300"
                >
                    {{ product.Collection?.name }}
                </router-link>
                <span class="mx-2">/</span>
                <router-link
                    :to="`/categories/${product.Category?.path}`"
                    class="hover:text-gray-300"
                >
                    {{ product.Category?.name }}
                </router-link>
                <span class="mx-2">/</span>
                <span>{{ product.name }}</span>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <!-- Left Column - Product Info -->
                <div class="space-y-6">
                    <h1 class="text-white text-5xl font-bold">
                        {{ product.name }}
                    </h1>
                    <p class="text-white text-sm">
                        {{ product.Category?.name }}
                    </p>
                    <p class="text-white text-2xl font-bold">
                        {{ formatPrice(product.price) }}
                    </p>

                    <!-- Size Selection -->
                    <div class="space-y-4" v-if="product.Sizes?.length">
                        <div class="flex justify-between items-center">
                            <p class="text-white text-sm">SIZE</p>
                            <p class="text-white text-sm" v-if="selectedSize">
                                Stock: {{ getStockForSize(selectedSize) }}
                            </p>
                        </div>
                        <div class="flex gap-4">
                            <button
                                v-for="sizeObj in product.Sizes"
                                :key="sizeObj.id"
                                :class="[
                                    'border px-4 py-2 transition-colors',
                                    selectedSize === sizeObj.size
                                        ? 'bg-white text-black'
                                        : 'text-white border-white hover:bg-white hover:text-black',
                                ]"
                                @click="selectSize(sizeObj.size)"
                            >
                                {{ sizeObj.size }}
                            </button>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="space-y-4">
                        <button
                            class="w-full bg-gray-700 text-white py-3 hover:bg-gray-600 transition-colors"
                            :disabled="!selectedSize"
                            :class="{
                                'opacity-50 cursor-not-allowed': !selectedSize,
                            }"
                        >
                            {{ selectedSize ? 'ADD TO CART' : 'SELECT SIZE' }}
                        </button>
                        <div class="w-full flex flex-col lg:flex-row gap-4">
                            <button
                                class="w-full bg-indigo-600 text-white py-3 hover:bg-indigo-700 transition-colors"
                                :disabled="!selectedSize"
                                :class="{
                                    'opacity-50 cursor-not-allowed':
                                        !selectedSize,
                                }"
                            >
                                Buy with ShopPay
                            </button>
                            <button
                                class="w-full bg-gray-700 text-white py-3 hover:bg-gray-600 transition-colors"
                            >
                                MORE PAYMENT OPTIONS
                            </button>
                        </div>
                    </div>

                    <!-- Additional Buttons -->
                    <div class="grid grid-cols-2 gap-4">
                        <button
                            class="bg-white text-black py-3 flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                        >
                            SIZE GUIDE
                        </button>
                        <button
                            @click.prevent="toggleWishlist"
                            :disabled="isWishlistLoading"
                            class="bg-white text-black py-3 flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors relative"
                            :class="{ 'opacity-75': isWishlistLoading }"
                        >
                            <!-- Loading Spinner -->
                            <div
                                v-if="isWishlistLoading"
                                class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75"
                            >
                                <div
                                    class="animate-spin rounded-full h-5 w-5 border-b-2 border-black"
                                ></div>
                            </div>

                            <!-- Heart Icon -->
                            <svg
                                class="w-6 h-6"
                                :class="{
                                    'fill-red-500 stroke-red-500': inWishlist,
                                }"
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
                            {{ inWishlist ? 'IN WISHLIST' : 'ADD TO WISHLIST' }}
                        </button>
                    </div>

                    <!-- Product Details -->
                    <div class="text-white space-y-2 mt-8">
                        <pre class="whitespace-pre-line font-sans text-white">{{
                            product.description
                        }}</pre>
                    </div>
                </div>

                <!-- Right Column - Protected Product Image -->
                <div
                    class="product-image-container relative bg-gray-900 aspect-square flex items-center justify-center overflow-hidden"
                >
                    <!-- Invisible overlay to prevent right-click -->
                    <div
                        class="absolute inset-0 w-full h-full z-10"
                        @contextmenu.prevent
                        @keydown.prevent="preventSave"
                        draggable="false"
                    ></div>

                    <!-- Image with protection -->
                    <div class="relative w-full h-full">
                        <img
                            v-if="getProductImage(product)"
                            :src="getProductImage(product)"
                            :alt="product.name"
                            class="w-full h-full object-cover select-none"
                            @dragstart.prevent
                            draggable="false"
                            style="
                                -webkit-user-select: none;
                                -webkit-touch-callout: none;
                            "
                            loading="lazy"
                        />
                        <div v-else class="text-gray-600 text-sm">
                            No image available
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { wishlistService } from '@/services/wishlistService'

// State
const product = ref(null)
const isLoading = ref(true)
const error = ref(null)
const selectedSize = ref(null)
const inWishlist = ref(false)
const isWishlistLoading = ref(false)

// Route
const route = useRoute()

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_BASE_API_URL
const BASE_URL = API_URL.split('/api/v1')[0]

// Methods for image protection
const preventSave = e => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'c')) {
        e.preventDefault()
    }
}

const preventContextMenu = e => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault()
    }
}

// Fetch product data
const fetchProduct = async () => {
    isLoading.value = true
    error.value = null
    selectedSize.value = null

    try {
        const response = await fetch(`${API_URL}/products/${route.params.id}`)
        const result = await response.json()

        if (result.status === 'success') {
            product.value = result.data
            // Check wishlist status after getting product
            await checkWishlistStatus()
        } else {
            throw new Error('Failed to fetch product')
        }
    } catch (err) {
        console.error('Error fetching product:', err)
        error.value = 'Failed to load product. Please try again later.'
    } finally {
        isLoading.value = false
    }
}

// Check if product is in wishlist
const checkWishlistStatus = async () => {
    try {
        if (!product.value) return

        const wishlistItems = await wishlistService.getWishlist()
        inWishlist.value = wishlistItems.some(
            item => item.id === product.value.id,
        )
    } catch (error) {
        console.error('Error checking wishlist status:', error)
    }
}

// Toggle wishlist
const toggleWishlist = async () => {
    if (isWishlistLoading.value) return

    try {
        isWishlistLoading.value = true

        if (inWishlist.value) {
            await wishlistService.removeFromWishlist(product.value.id)
            inWishlist.value = false
        } else {
            await wishlistService.addToWishlist(product.value.id)
            inWishlist.value = true
        }
    } catch (error) {
        console.error('Error toggling wishlist:', error)
    } finally {
        isWishlistLoading.value = false
    }
}

// Other methods
const formatPrice = price => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price)
}

const getProductImage = product => {
    if (product.ProductAssets && product.ProductAssets.length > 0) {
        const assetUrl =
            product.ProductAssets[product.ProductAssets.length - 1].asset_url
        if (assetUrl.startsWith('http')) {
            return assetUrl
        }
        return `${BASE_URL}/${assetUrl}`
    }
    return null
}

const selectSize = size => {
    selectedSize.value = selectedSize.value === size ? null : size
}

const getStockForSize = size => {
    const sizeObj = product.value?.Sizes.find(s => s.size === size)
    return sizeObj?.ProductSize?.stock || 0
}

// Lifecycle hooks
onMounted(() => {
    document.addEventListener('keydown', preventSave)
    document.addEventListener('contextmenu', preventContextMenu)
    document.addEventListener('dragstart', e => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault()
        }
    })
    fetchProduct()
})

onUnmounted(() => {
    document.removeEventListener('keydown', preventSave)
    document.removeEventListener('contextmenu', preventContextMenu)
})
</script>

<style scoped>
.product-image-container {
    /* Prevent selection */
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    /* Prevent touch callout on iOS */
    -webkit-touch-callout: none;
}

.product-image-container img {
    /* Disable pointer events on image */
    pointer-events: none;
    /* Slightly reduce image quality to discourage saving */
    filter: brightness(0.95);
}
</style>
