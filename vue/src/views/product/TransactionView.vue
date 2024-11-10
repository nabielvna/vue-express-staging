<template>
    <div class="max-w-[1440px] mx-auto px-4 py-12">
        <h1 class="text-3xl font-bold text-white mb-8 uppercase tracking-wider">
            Riwayat Transaksi
        </h1>

        <!-- Filter Section -->
        <div class="bg-[#131313] border border-zinc-800 rounded-lg p-6 mb-8">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-white text-lg font-medium">Filter</h2>
                <!-- Clear Filter Button -->
                <button
                    v-if="isFiltered"
                    @click="clearFilters"
                    class="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
                >
                    <span>Clear Filters</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
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
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label
                        class="block text-zinc-400 text-sm uppercase tracking-wider mb-2"
                        >Status</label
                    >
                    <select
                        v-model="filterStatus"
                        class="w-full bg-black text-white rounded-md px-4 py-3 border border-zinc-800 focus:border-white transition-colors"
                    >
                        <option value="">Semua Status</option>
                        <option
                            v-for="status in orderStatuses"
                            :key="status.id"
                            :value="status.id"
                        >
                            {{ status.name }}
                        </option>
                    </select>
                </div>
                <div>
                    <label
                        class="block text-zinc-400 text-sm uppercase tracking-wider mb-2"
                        >Periode</label
                    >
                    <select
                        v-model="filterPeriod"
                        class="w-full bg-black text-white rounded-md px-4 py-3 border border-zinc-800 focus:border-white transition-colors"
                    >
                        <option value="">Semua Periode</option>
                        <option value="7">7 Hari Terakhir</option>
                        <option value="30">30 Hari Terakhir</option>
                        <option value="90">90 Hari Terakhir</option>
                        <option value="365">1 Tahun Terakhir</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Transaction Summary -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div class="bg-[#131313] border border-zinc-800 rounded-lg p-6">
                <div class="flex flex-col">
                    <span
                        class="text-zinc-400 text-sm uppercase tracking-wider mb-2"
                        >Total Pesanan</span
                    >
                    <span class="text-3xl font-bold text-white">{{
                        pagination.total || 0
                    }}</span>
                </div>
            </div>
            <div
                v-for="status in orderStatusSummary"
                :key="status.id"
                class="bg-[#131313] border border-zinc-800 rounded-lg p-6"
            >
                <div class="flex flex-col">
                    <span
                        class="text-zinc-400 text-sm uppercase tracking-wider mb-2"
                        >{{ status.name }}</span
                    >
                    <span class="text-3xl font-bold text-zinc-200">{{
                        status.count
                    }}</span>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div
            v-if="loading"
            class="bg-[#131313] border border-zinc-800 rounded-lg p-12 text-center"
        >
            <p class="text-zinc-400 text-lg">Loading...</p>
        </div>

        <!-- Error State -->
        <div
            v-else-if="error"
            class="bg-[#131313] border border-zinc-800 rounded-lg p-12 text-center"
        >
            <p class="text-red-400 text-lg">{{ error }}</p>
        </div>

        <!-- Transaction List -->
        <div v-else class="space-y-4">
            <div
                v-for="order in orders"
                :key="order.id"
                class="bg-[#131313] border border-zinc-800 rounded-lg p-6 hover:border-zinc-600 transition-colors"
            >
                <div class="flex flex-col md:flex-row gap-6">
                    <!-- Order Details -->
                    <div class="flex-grow space-y-4">
                        <div>
                            <h3 class="text-white text-lg font-medium mb-2">
                                Order #{{ order.id }}
                            </h3>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p
                                        class="text-zinc-400 text-sm uppercase tracking-wider mb-1"
                                    >
                                        Total Items
                                    </p>
                                    <p class="text-white">
                                        {{ order.total_item }}
                                    </p>
                                </div>
                                <div>
                                    <p
                                        class="text-zinc-400 text-sm uppercase tracking-wider mb-1"
                                    >
                                        Total Price
                                    </p>
                                    <p class="text-white font-medium">
                                        {{ formatPrice(order.total_price) }}
                                    </p>
                                </div>
                                <div>
                                    <p
                                        class="text-zinc-400 text-sm uppercase tracking-wider mb-1"
                                    >
                                        Status
                                    </p>
                                    <p class="text-white">
                                        {{ order.OrderStatus?.name }}
                                    </p>
                                </div>
                                <div>
                                    <p
                                        class="text-zinc-400 text-sm uppercase tracking-wider mb-1"
                                    >
                                        Date
                                    </p>
                                    <p class="text-white">
                                        {{ formatDate(order.created_at) }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Order Items -->
                        <div class="space-y-4 pt-4 border-t border-zinc-800">
                            <div
                                v-for="item in order.OrderItems"
                                :key="item.id"
                                class="flex gap-4"
                            >
                                <div
                                    class="w-20 h-20 bg-black rounded-lg overflow-hidden flex-shrink-0 border border-zinc-800"
                                >
                                    <img
                                        v-if="getProductImage(item)"
                                        :src="getProductImage(item)"
                                        :alt="getProductName(item)"
                                        class="w-full h-full object-cover"
                                    />
                                </div>
                                <div class="flex-grow">
                                    <h4 class="text-white font-medium">
                                        {{ getProductName(item) }}
                                    </h4>
                                    <p class="text-zinc-400">
                                        Size: {{ getProductSize(item) }}
                                    </p>
                                    <p class="text-zinc-400">
                                        Quantity: {{ item.quantity }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div
                            class="flex pt-4 border-t border-zinc-800 justify-between items-center"
                        >
                            <div class="flex flex-wrap gap-4">
                                <button
                                    @click="viewDetail(order.id)"
                                    class="px-6 py-2 border border-white text-white text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
                                >
                                    Detail Pesanan
                                </button>
                            </div>
                            <span
                                class="px-4 py-2 text-sm uppercase tracking-wider font-medium"
                                :class="getStatusClass(order.OrderStatus?.name)"
                            >
                                {{ order.OrderStatus?.name }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div
            v-if="!loading && !error && orders.length === 0"
            class="bg-[#131313] border border-zinc-800 rounded-lg p-12 text-center"
        >
            <p class="text-zinc-400 text-lg">
                Tidak ada transaksi yang ditemukan
            </p>
        </div>

        <!-- Pagination -->
        <div
            v-if="pagination.total_pages > 1"
            class="mt-8 flex justify-center gap-2"
        >
            <button
                v-for="page in pagination.total_pages"
                :key="page"
                @click="changePage(page)"
                :class="[
                    'px-4 py-2 text-sm border',
                    currentPage === page
                        ? 'bg-white text-black border-white'
                        : 'text-white border-zinc-800 hover:border-white',
                ]"
            >
                {{ page }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axiosInstance from '@/utils/axios'

const router = useRouter()
const orders = ref([])
const orderStatuses = ref([])
const orderSummary = ref({})
const loading = ref(false)
const error = ref(null)
const filterStatus = ref('')
const filterPeriod = ref('')
const currentPage = ref(1)
const pagination = ref({
    total: 0,
    page: 1,
    total_pages: 0,
})

// Check if any filters are active
const isFiltered = computed(() => {
    return filterStatus.value !== '' || filterPeriod.value !== ''
})

// Status summary counts
const orderStatusSummary = computed(() => {
    if (
        !orderStatuses.value ||
        !Array.isArray(orderStatuses.value) ||
        orderStatuses.value.length === 0
    )
        return []

    return orderStatuses.value.map(status => ({
        id: status.id,
        name: status.name,
        count: orderSummary.value[status.name] || 0,
    }))
})

// Helper functions for order items with null safety
// Helper functions for order items with null safety
const getProductImage = item => {
    if (!item?.ProductSize?.Product?.ProductAssets?.length)
        return '/placeholder-image.jpg'

    const assetUrl = item.ProductSize.Product.ProductAssets[0]?.asset_url
    if (!assetUrl) return '/placeholder-image.jpg'

    const baseUrl = import.meta.env.VITE_BASE_API_URL.split('/api/v1')[0]
    return `${baseUrl}/${assetUrl}`
}

const getProductName = item => {
    return item?.ProductSize?.Product?.name || 'Product Name Not Available'
}

const getProductSize = item => {
    return item?.ProductSize?.Size?.size || 'Size Not Available'
}

const getStatusClass = status => {
    if (!status) return 'border border-zinc-500 text-zinc-500'

    const statusClasses = {
        Pending: 'border border-yellow-500 text-yellow-500',
        Processing: 'border border-blue-500 text-blue-500',
        Shipped: 'border border-purple-500 text-purple-500',
        Delivered: 'border border-green-500 text-green-500',
        Cancelled: 'border border-red-500 text-red-500',
    }
    return statusClasses[status] || 'border border-zinc-500 text-zinc-500'
}

// Format functions with null safety
const formatPrice = price => {
    if (!price) return 'Rp0'
    return `Rp${Number(price).toLocaleString('id-ID')}`
}

const formatDate = dateString => {
    if (!dateString) return ''
    try {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    } catch (err) {
        console.error('Error formatting date:', err)
        return ''
    }
}

// Clear all filters
const clearFilters = () => {
    filterStatus.value = ''
    filterPeriod.value = ''
    currentPage.value = 1
    fetchOrders()
}

// Function to get date range based on period
const getDateRange = days => {
    if (!days) return null
    try {
        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(endDate.getDate() - parseInt(days))
        return {
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0],
        }
    } catch (err) {
        console.error('Error calculating date range:', err)
        return null
    }
}

// API calls with proper error handling
const fetchOrderStatuses = async () => {
    try {
        const response = await axiosInstance.get('/order-statuses')
        if (response?.data?.status === 'success') {
            orderStatuses.value = Array.isArray(response.data.data)
                ? response.data.data
                : []
        } else {
            throw new Error(
                response?.data?.message || 'Failed to fetch order statuses',
            )
        }
    } catch (err) {
        console.error('Error fetching order statuses:', err)
        error.value =
            err?.response?.data?.message || 'Failed to load order statuses'
        orderStatuses.value = []
    }
}

const fetchOrders = async () => {
    loading.value = true
    error.value = null

    try {
        const params = {
            page: currentPage.value,
            limit: 10,
        }

        if (filterStatus.value) {
            params.status = filterStatus.value
        }

        if (filterPeriod.value) {
            const dateRange = getDateRange(filterPeriod.value)
            if (dateRange) {
                params.start_date = dateRange.start_date
                params.end_date = dateRange.end_date
            }
        }

        const response = await axiosInstance.get('/orders/my-orders', {
            params,
        })

        if (response?.data?.status === 'success') {
            // Update orders data
            orders.value = Array.isArray(response.data.data.orders)
                ? response.data.data.orders
                : []

            // Update order summary
            orderSummary.value = response.data.data.summary || {}

            // Update pagination
            const paginationData = response.data.data.pagination || {}
            pagination.value = {
                total: paginationData.total || 0,
                page: paginationData.page || 1,
                total_pages: paginationData.total_pages || 1,
            }
        } else {
            throw new Error(response?.data?.message || 'Failed to fetch orders')
        }
    } catch (err) {
        console.error('Error fetching orders:', err)
        error.value =
            err?.response?.data?.message ||
            'Failed to load orders. Please try again.'
        orders.value = []
        orderSummary.value = {}
    } finally {
        loading.value = false
    }
}

// Event handlers
const viewDetail = orderId => {
    if (!orderId) return
    router.push(`/transaction/${orderId}`)
}

const changePage = page => {
    if (!page || page === currentPage.value) return
    currentPage.value = page
    fetchOrders()
}

// Watchers for filters
watch(
    [filterStatus, filterPeriod],
    ([newStatus, newPeriod], [oldStatus, oldPeriod]) => {
        if (newStatus !== oldStatus || newPeriod !== oldPeriod) {
            currentPage.value = 1
            fetchOrders()
        }
    },
    { deep: true },
)

// Initialize
onMounted(async () => {
    try {
        await Promise.all([fetchOrderStatuses(), fetchOrders()])
    } catch (err) {
        console.error('Error during initialization:', err)
        error.value = 'Failed to initialize page. Please refresh.'
    }
})
</script>
