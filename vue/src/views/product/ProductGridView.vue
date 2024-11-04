<template>
    <div class="p-8 bg-black" ref="scrollComponent">
        <!-- Initial Loading -->
        <div
            v-if="isLoading && !products.length"
            class="flex justify-center py-12"
        >
            <div
                class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"
            ></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
            <p class="text-red-500">{{ error }}</p>
            <button
                @click="resetAndFetch"
                class="mt-4 px-4 py-2 bg-white text-black hover:bg-gray-200 transition-colors duration-200 rounded"
            >
                Try Again
            </button>
        </div>

        <template v-else>
            <!-- Header -->
            <header class="text-center mb-20">
                <h1
                    class="text-3xl md:text-4xl font-bold text-white tracking-wider"
                >
                    {{ title.toUpperCase() }}
                </h1>
            </header>

            <!-- Product Grid -->
            <div
                v-if="products.length"
                class="product-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
                <div
                    v-for="product in products"
                    :key="product.id"
                    class="product-card group flex flex-col cursor-pointer transform transition-all duration-200 hover:scale-[103%]"
                    @click="viewProduct(product.id)"
                >
                    <!-- Protected Product Image Container -->
                    <div
                        class="image-container mb-6 bg-gray-900 aspect-square flex items-center justify-center relative overflow-hidden"
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
                            <WishlistButton :product-id="product.id" />
                            <img
                                v-if="getProductImage(product)"
                                :src="getProductImage(product)"
                                :alt="product.name"
                                class="w-full h-full object-cover aspect-square select-none"
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

                    <!-- Product Info -->
                    <div class="product-info text-center space-y-2">
                        <h3 class="text-lg font-semibold text-white">
                            {{ product.name }}
                        </h3>
                        <p
                            v-if="product.description"
                            class="text-sm text-gray-400 opacity-0 transform -translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0"
                        >
                            {{ truncateDescription(product.description) }}
                        </p>
                        <p
                            class="product-price text-white font-bold opacity-0 transform -translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0"
                        >
                            {{ formatPrice(product.price) }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Loading More Indicator -->
            <div v-if="isLoadingMore" class="flex justify-center py-8">
                <div
                    class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"
                ></div>
            </div>

            <!-- No More Products -->
            <div
                v-if="!hasMore && products.length > 0"
                class="text-center py-8 text-gray-400 font-semibold tracking-widest"
            >
                END OF {{ title.toUpperCase() }}
            </div>

            <!-- Empty State -->
            <div
                v-if="!products.length && !isLoading"
                class="text-center py-12"
            >
                <p class="text-gray-400">No products found</p>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import WishlistButton from '@/components/product/WishlistButton.vue'

const router = useRouter()

const props = defineProps({
    type: {
        type: String,
        required: true,
        validator: value => ['collections', 'categories'].includes(value),
    },
    path: {
        type: String,
        required: true,
    },
})

// State
const products = ref([])
const isLoading = ref(true)
const isLoadingMore = ref(false)
const error = ref(null)
const title = ref('')
const page = ref(1)
const hasMore = ref(true)
const scrollComponent = ref(null)
const ITEMS_PER_PAGE = 12

const API_URL = import.meta.env.VITE_BASE_API_URL
const BASE_URL = API_URL.split('/api/v1')[0]

// Handle scroll event with debounce
let scrollTimeout = null
const handleScroll = () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout)
    }

    scrollTimeout = setTimeout(async () => {
        if (!scrollComponent.value) return

        const element = scrollComponent.value
        const rect = element.getBoundingClientRect()

        // Check if we're near the bottom of the element
        if (rect.bottom < window.innerHeight + 450) {
            if (!isLoadingMore.value && hasMore.value) {
                await loadMoreProducts()
            }
        }
    })
}

// Load more products
const loadMoreProducts = async () => {
    if (isLoadingMore.value || !hasMore.value) return

    try {
        isLoadingMore.value = true

        const response = await fetch(
            `${API_URL}/${props.type}/path/${props.path}?page=${page.value}&limit=${ITEMS_PER_PAGE}`,
        )

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()

        if (result.status === 'success' && result.data) {
            const newProducts = result.data.Products || []
            products.value = [...products.value, ...newProducts]

            // Update pagination
            const totalItems = result.data.pagination?.totalItems || 0
            hasMore.value = products.value.length < totalItems

            if (hasMore.value) {
                page.value++
            }
        } else {
            throw new Error(result.message || 'Failed to fetch products')
        }
    } catch (err) {
        console.error('Error loading more products:', err)
        error.value = 'Failed to load more products'
    } finally {
        isLoadingMore.value = false
    }
}

// Initial data fetch
const fetchInitialData = async () => {
    try {
        isLoading.value = true
        error.value = null

        const response = await fetch(
            `${API_URL}/${props.type}/path/${props.path}?page=1&limit=${ITEMS_PER_PAGE}`,
        )

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()

        if (result.status === 'success' && result.data) {
            products.value = result.data.Products || []
            title.value = result.data.name

            // Initialize pagination
            const totalItems = result.data.pagination?.totalItems || 0
            hasMore.value = products.value.length < totalItems
            page.value = 2
        } else {
            throw new Error(result.message || 'Failed to fetch products')
        }
    } catch (err) {
        console.error('Error fetching initial data:', err)
        error.value = 'Failed to load products'
    } finally {
        isLoading.value = false
    }
}

// Reset and fetch
const resetAndFetch = () => {
    products.value = []
    page.value = 1
    hasMore.value = true
    error.value = null
    fetchInitialData()
}

// Utility functions
const getProductImage = product => {
    if (product.ProductAssets?.[0]?.asset_url) {
        const assetUrl = product.ProductAssets[0].asset_url
        return assetUrl.startsWith('http')
            ? assetUrl
            : `${BASE_URL}/${assetUrl}`
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
    return description.length <= maxLength
        ? description
        : `${description.substring(0, maxLength)}...`
}

const viewProduct = id => {
    router.push({ path: `/product/${id}` })
}

// Watch for route changes
watch(
    () => [props.type, props.path],
    () => resetAndFetch(),
    { immediate: true },
)

// Setup scroll listener
onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    if (scrollTimeout) {
        clearTimeout(scrollTimeout)
    }
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
}

.image-container img {
    /* Disable pointer events on image */
    pointer-events: none;
    /* Slightly reduce image quality to discourage saving */
    filter: brightness(0.95);
}
</style>
