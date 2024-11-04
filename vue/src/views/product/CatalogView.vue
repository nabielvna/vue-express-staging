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
                @click="fetchData"
                class="mt-4 px-4 py-2 bg-white text-black hover:bg-gray-200 transition-colors duration-200 rounded"
            >
                Try Again
            </button>
        </div>

        <!-- Main Content -->
        <div v-else class="max-w-7xl mx-auto space-y-16">
            <!-- Title -->
            <h1
                class="text-4xl font-bold text-white text-center tracking-widest"
            >
                {{ type === 'collections' ? 'COLLECTIONS' : 'CATEGORIES' }}
            </h1>

            <!-- Collections/Categories List -->
            <div class="space-y-20">
                <div
                    v-for="item in items"
                    :key="item.id"
                    class="section space-y-8"
                >
                    <!-- Section Header -->
                    <div class="text-center space-y-4">
                        <h2
                            class="text-2xl font-bold text-white uppercase tracking-[0.2em]"
                        >
                            {{ item.name }}
                        </h2>
                        <router-link
                            :to="`/${type}/${item.path}`"
                            class="inline-block text-gray-400 hover:text-white transition-colors duration-200"
                        >
                            View All
                            <span class="text-xs"
                                >({{ item.total_products }})</span
                            >
                            →
                        </router-link>
                    </div>

                    <!-- Product Grid -->
                    <div
                        class="product-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                    >
                        <div
                            v-for="product in item.Products.slice(0, 3)"
                            :key="product.id"
                            class="product-card group flex flex-col cursor-pointer transform transition-all duration-200 hover:scale-[101%] relative"
                            @click="viewProduct(product.id)"
                        >
                            <!-- Wishlist Button Component -->
                            <WishlistButton :product-id="product.id" />
                            <!-- Protected Product Image Container -->
                            <div
                                class="image-container mb-6 bg-gray-900 aspect-square flex items-center justify-center relative overflow-hidden"
                            >
                                <!-- Invisible overlay to prevent right-click -->
                                <div
                                    class="absolute inset-0 w-full h-full z-10"
                                    @contextmenu.prevent
                                    @keydown.prevent="preventSave"
                                    @touchstart.prevent="preventLongPress"
                                    draggable="false"
                                ></div>
                                <!-- Image with protection -->
                                <div
                                    class="relative items-center justify-center"
                                >
                                    <img
                                        v-if="getProductImage(product)"
                                        :src="getProductImage(product)"
                                        :alt="product.name"
                                        class="w-full h-full aspect-square object-cover select-none protected-image"
                                        @dragstart.prevent
                                        @selectstart.prevent
                                        draggable="false"
                                        loading="lazy"
                                    />
                                    <div
                                        v-else
                                        class="text-gray-600 text-sm h-full"
                                    >
                                        No image available
                                    </div>
                                </div>
                            </div>

                            <!-- Product Info -->
                            <div class="product-info text-center space-y-2">
                                <h3 class="text-lg font-semibold text-white">
                                    {{ product.name }}
                                </h3>
                                <p
                                    class="text-sm text-gray-400 opacity-0 transform -translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0"
                                >
                                    {{
                                        truncateDescription(product.description)
                                    }}
                                </p>
                                <p
                                    class="text-white font-bold opacity-0 transform -translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0"
                                >
                                    {{ formatPrice(product.price) }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="items.length === 0" class="text-center py-12">
                <p class="text-gray-400">No {{ type }} found</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import WishlistButton from '@/components/product/WishlistButton.vue'

// Props
const props = defineProps({
    type: {
        type: String,
        required: true,
        validator: value => ['collections', 'categories'].includes(value),
    },
})

// State
const items = ref([])
const isLoading = ref(true)
const error = ref(null)

// Router
const router = useRouter()
const route = useRoute()

// API URLs
const API_URL = import.meta.env.VITE_BASE_API_URL
const BASE_URL = API_URL.split('/api/v1')[0]

// Methods
const fetchData = async () => {
    isLoading.value = true
    error.value = null
    items.value = []

    try {
        const response = await fetch(`${API_URL}/${props.type}`)
        const result = await response.json()

        if (result.status === 'success') {
            items.value = result.data
        } else {
            throw new Error(`Failed to fetch ${props.type}`)
        }
    } catch (err) {
        console.error(`Error fetching ${props.type}:`, err)
        error.value = `Failed to load ${props.type}. Please try again later.`
    } finally {
        isLoading.value = false
    }
}

const getProductImage = product => {
    if (product.ProductAssets && product.ProductAssets.length > 0) {
        const assetUrl = product.ProductAssets[0].asset_url
        if (assetUrl.startsWith('http')) {
            return assetUrl
        }
        return `${BASE_URL}/${assetUrl}`
    }
    return null
}

const formatPrice = price => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price)
}

const truncateDescription = (description, maxLength = 100) => {
    if (!description) return ''
    if (description.length <= maxLength) return description
    return description.substring(0, maxLength) + '...'
}

const viewProduct = id => {
    router.push({
        path: `/product/${id}`,
    })
}

// Image Protection Methods
const preventSave = e => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'c')) {
        e.preventDefault()
        return false
    }
}

const preventLongPress = e => {
    e.preventDefault()
    return false
}

// Disable browser's default image context menu
const disableImageContextMenu = e => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault()
        return false
    }
}

// Watch for type changes
watch(
    () => props.type,
    newType => {
        if (newType) {
            fetchData()
        }
    },
)

// Watch for route changes
watch(
    () => route.path,
    () => {
        fetchData()
    },
)

// Lifecycle Hooks
onMounted(() => {
    fetchData()

    // Add event listeners for image protection
    document.addEventListener('keydown', preventSave)
    document.addEventListener('contextmenu', disableImageContextMenu)
    document.addEventListener('dragstart', e => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault()
        }
    })

    // Disable selection on the page
    document.addEventListener('selectstart', e => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault()
        }
    })
})

onUnmounted(() => {
    // Clean up event listeners
    document.removeEventListener('keydown', preventSave)
    document.removeEventListener('contextmenu', disableImageContextMenu)
    document.removeEventListener('selectstart', () => {})
})
</script>

<style scoped>
.image-container {
    /* Prevent selection */
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    /* Prevent touch callout on iOS */
    -webkit-touch-callout: none;

    /* Prevent highlighting */
    -webkit-tap-highlight-color: transparent;
}

.protected-image {
    /* Disable pointer events on the image itself */
    pointer-events: none;

    /* Add slight protection effect */
    filter: brightness(0.95) contrast(0.95);

    /* Prevent image dragging */
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
}

/* Disable selection globally for images */
img {
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
}
</style>
