<template>
    <div class="min-h-screen bg-black p-28">
        <!-- Header section -->
        <div class="mb-8">
            <div class="flex justify-between items-center">
                <div>
                    <h1 class="text-3xl font-bold text-white tracking-wider uppercase">
                        Orders
                    </h1>
                    <p class="text-zinc-400 mt-1 tracking-wide">
                        Manage and track your customer orders
                    </p>
                </div>
                <div class="flex space-x-4">
                    <!-- Export Button -->
                    <button
                        @click="handleExport"
                        class="px-4 py-2 bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-lg hover:border-purple-500 transition-all duration-300 flex items-center group"
                    >
                        <svg
                            class="w-4 h-4 mr-2 text-zinc-400 group-hover:text-purple-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                        >
                            <path
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                        Export Data
                    </button>
                </div>
            </div>

            <!-- Filters section -->
            <div class="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <!-- Search Filter -->
                <div class="relative">
                    <input
                        v-model="filters.search"
                        type="text"
                        placeholder="Search orders..."
                        class="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                        @input="handleSearch"
                    />
                </div>

                <!-- Status Filter -->
                <div class="relative">
                    <select
                        v-model="filters.status"
                        class="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 appearance-none"
                        @change="loadOrders"
                    >
                        <option value="">All Statuses</option>
                        <option v-for="status in orderStatuses" :key="status.id" :value="status.id">
                            {{ status.name }}
                        </option>
                    </select>
                </div>

                <!-- Date Range Filters -->
                <div class="relative">
                    <input
                        v-model="filters.startDate"
                        type="date"
                        class="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                        @change="loadOrders"
                    />
                </div>
                <div class="relative">
                    <input
                        v-model="filters.endDate"
                        type="date"
                        class="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                        @change="loadOrders"
                    />
                </div>
            </div>
        </div>

        <!-- Orders Table -->
        <div class="bg-zinc-900 rounded-lg border border-zinc-800">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-zinc-800">
                    <thead>
                        <tr class="bg-zinc-900/50">
                            <th class="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                Order ID
                            </th>
                            <th class="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                Customer
                            </th>
                            <th class="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th class="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                Date
                            </th>
                            <th class="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                Total
                            </th>
                            <th class="px-6 py-4 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-zinc-800">
                        <tr
                            v-for="order in orders"
                            :key="order.id"
                            class="hover:bg-zinc-800/50 transition-colors duration-200"
                        >
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="text-sm font-mono text-purple-400 font-medium">
                                    #{{ order.id }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white text-sm font-medium">
                                        {{ getInitials(order.User.name) }}
                                    </div>
                                    <div class="ml-3">
                                        <div class="text-sm font-medium text-white">
                                            {{ order.User.name }}
                                        </div>
                                        <div class="text-sm text-zinc-400">
                                            {{ order.User.email }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getStatusClass(order.OrderStatus.name.toLowerCase())">
                                    {{ order.OrderStatus.name }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-zinc-300">
                                    {{ formatDate(order.created_at) }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-mono text-white">
                                    Rp{{ formatPrice(order.total_price) }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                <button
                                    @click="viewOrder(order)"
                                    class="text-purple-400 hover:text-purple-300 transition-colors duration-200"
                                >
                                    View
                                </button>
                                <button
                                    @click="openUpdateStatus(order)"
                                    class="text-zinc-400 hover:text-white transition-colors duration-200"
                                >
                                    Update Status
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="px-6 py-4 border-t border-zinc-800">
                <div class="flex items-center justify-between">
                    <div class="text-sm text-zinc-400">
                        Showing
                        <span class="font-medium text-white">{{ pagination.start }}</span>
                        to
                        <span class="font-medium text-white">{{ pagination.end }}</span>
                        of
                        <span class="font-medium text-white">{{ pagination.total }}</span>
                        results
                    </div>
                    <div class="flex space-x-2">
                        <button
                            @click="prevPage"
                            :disabled="pagination.currentPage === 1"
                            class="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <div class="flex space-x-1">
                            <button
                                v-for="page in displayedPages"
                                :key="page"
                                @click="goToPage(page)"
                                class="px-3 py-1 text-sm rounded-md"
                                :class="page === pagination.currentPage ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'"
                            >
                                {{ page }}
                            </button>
                        </div>
                        <button
                            @click="nextPage"
                            :disabled="pagination.currentPage === pagination.totalPages"
                            class="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- View Order Modal -->
        <NormalModal
            v-if="showViewModal"
            title="Order Details"
            @close="showViewModal = false"
        >
            <div v-if="selectedOrder" class="space-y-6">
                <!-- Order Info -->
                <div class="space-y-4">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="text-lg font-medium text-white">Order #{{ selectedOrder.id }}</h3>
                            <p class="text-sm text-zinc-400">{{ formatDate(selectedOrder.created_at) }}</p>
                        </div>
                        <span :class="getStatusClass(selectedOrder.OrderStatus.name.toLowerCase())">
                            {{ selectedOrder.OrderStatus.name }}
                        </span>
                    </div>

                    <!-- Customer Info -->
                    <div class="bg-zinc-800/50 p-4 rounded-lg">
                        <h4 class="text-sm font-medium text-zinc-300 mb-2">Customer Information</h4>
                        <div class="space-y-1">
                            <p class="text-sm text-white">{{ selectedOrder.User.name }}</p>
                            <p class="text-sm text-zinc-400">{{ selectedOrder.User.email }}</p>
                            <p class="text-sm text-zinc-400">{{ selectedOrder.User.phone_number }}</p>
                        </div>
                    </div>

                    <!-- Shipping Address -->
                    <div class="bg-zinc-800/50 p-4 rounded-lg">
                        <h4 class="text-sm font-medium text-zinc-300 mb-2">Shipping Address</h4>
                        <div class="space-y-1 text-sm text-zinc-400">
                            <p>{{ selectedOrder.Address.street_address }}</p>
                            <p>{{ selectedOrder.Address.subdistrict }}, {{ selectedOrder.Address.city }}</p>
                            <p>{{ selectedOrder.Address.province }}, {{ selectedOrder.Address.postal_code }}</p>
                        </div>
                    </div>

                    <!-- Order Items -->
                    <div class="space-y-3">
                        <h4 class="text-sm font-medium text-zinc-300">Order Items</h4>
                        <div class="space-y-2">
                            <div v-for="item in selectedOrder.OrderItems" :key="item.id"
                                class="flex justify-between items-center bg-zinc-800/30 p-3 rounded-lg">
                                <div class="flex items-center space-x-3">
                                    <img
                                        v-if="item.ProductSize.Product.ProductAssets[0]"
                                        :src="item.ProductSize.Product.ProductAssets[0].asset_url"
                                        class="w-12 h-12 rounded-lg object-cover"
                                    />
                                    <div>
                                        <p class="text-sm text-white">{{ item.ProductSize.Product.name }}</p>
                                        <p class="text-xs text-zinc-400">Size: {{ item.ProductSize.Size.size }}</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="text-sm text-white">{{ item.quantity }}x</p>
                                    <p class="text-xs text-zinc-400">
                                        Rp{{ formatPrice(item.ProductSize.Product.price) }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Order Summary -->
                    <div class="border-t border-zinc-700 pt-4">
                        <div class="flex justify-between text-sm">
                            <span class="text-zinc-400">Total Items:</span>
                            <span class="text-white">{{ selectedOrder.total_item }}</span>
                        </div>
                        <div class="flex justify-between text-sm mt-2">
                            <span class="text-zinc-400">Total Amount:</span>
                            <span class="text-white font-medium">
                                Rp{{ formatPrice(selectedOrder.total_price) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </NormalModal>

        <!-- Update Status Modal -->
        <NormalModal
            v-if="showStatusModal"
            title="Update Order Status"
            @close="showStatusModal = false"
        >
            <div class="space-y-4">
                <div class="space-y-2">
                    <label class="text-sm text-zinc-400">Select New Status</label>
                    <select
                        v-model="newStatus"
                        class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                    >
                        <option v-for="status in orderStatuses" :key="status.id" :value="status.id">
                            {{ status.name }}
                        </option>
                    </select>
                </div>
                <div class="flex justify-end space-x-3">
                    <button
                        @click="showStatusModal = false"
                        class="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        @click="updateOrderStatus"
                        class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Update Status
                    </button>
                </div>
            </div>
        </NormalModal>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import NormalModal from '@/components/NormalModal.vue'
import axiosInstance from '@/utils/axios'

// State
const orders = ref([])
const orderStatuses = ref([])
const selectedOrder = ref(null)
const showViewModal = ref(false)
const showStatusModal = ref(false)
const newStatus = ref(null)
const filters = ref({
    search: '',
    status: '',
    startDate: '',
    endDate: ''
})

const pagination = ref({
    currentPage: 1,
    total: 0,
    perPage: 10,
    totalPages: 0
})

// Computed
const displayedPages = computed(() => {
    const pages = []
    const maxDisplayed = 5
    let start = Math.max(1, pagination.value.currentPage - Math.floor(maxDisplayed / 2))
    let end = Math.min(pagination.value.totalPages, start + maxDisplayed - 1)

    if (end - start + 1 < maxDisplayed) {
        start = Math.max(1, end - maxDisplayed + 1)
    }

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }
    return pages
})

// Methods
const loadOrders = async () => {
    try {
        const params = {
            page: pagination.value.currentPage,
            limit: pagination.value.perPage,
            search: filters.value.search,
            status: filters.value.status,
            start_date: filters.value.startDate,
            end_date: filters.value.endDate
        }

        const response = await axiosInstance.get('/orders', { params })
        orders.value = response.data.data.orders
        pagination.value.total = response.data.data.pagination.total
        pagination.value.totalPages = response.data.data.pagination.total_pages
    } catch (error) {
        console.error('Error loading orders:', error)
    }
}

const loadOrderStatuses = async () => {
    try {
        const response = await axiosInstance.get('/order-statuses')
        orderStatuses.value = response.data.data
    } catch (error) {
        console.error('Error loading order statuses:', error)
    }
}

const handleSearch = () => {
    pagination.value.currentPage = 1
    loadOrders()
}

const viewOrder = async (order) => {
    try {
        const response = await axiosInstance.get(`/orders/${order.id}`)
        selectedOrder.value = response.data.data
        showViewModal.value = true
    } catch (error) {
        console.error('Error fetching order details:', error)
    }
}

const openUpdateStatus = (order) => {
    selectedOrder.value = order
    newStatus.value = order.OrderStatus.id
    showStatusModal.value = true
}

const updateOrderStatus = async () => {
    try {
        await axiosInstance.put(`/orders/${selectedOrder.value.id}/status`, {
            order_status_id: newStatus.value
        })

        showStatusModal.value = false
        loadOrders()
    } catch (error) {
        console.error('Error updating order status:', error)
    }
}

const handleExport = async () => {
    try {
        const params = {
            start_date: filters.value.startDate,
            end_date: filters.value.endDate,
            status: filters.value.status
        }

        const response = await axiosInstance.get('/orders/export', { params })

        // Convert the data to CSV format
        const exportData = response.data.data
        const headers = ['Order ID', 'Date', 'Customer', 'Email', 'Status', 'Total Items', 'Total Price']
        const csvContent = [
            headers.join(','),
            ...exportData.map(order => [
                order.order_id,
                new Date(order.date).toLocaleDateString(),
                order.customer_name,
                order.customer_email,
                order.status,
                order.total_items,
                order.total_price
            ].join(','))
        ].join('\n')

        // Create and download the CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `orders_export_${new Date().toISOString()}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    } catch (error) {
        console.error('Error exporting orders:', error)
    }
}

// Pagination methods
const goToPage = (page) => {
    pagination.value.currentPage = page
    loadOrders()
}

const nextPage = () => {
    if (pagination.value.currentPage < pagination.value.totalPages) {
        pagination.value.currentPage++
        loadOrders()
    }
}

const prevPage = () => {
    if (pagination.value.currentPage > 1) {
        pagination.value.currentPage--
        loadOrders()
    }
}

// Utility functions
const getInitials = (name) => {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
}

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const formatPrice = (price) => {
    return Number(price).toLocaleString('id-ID')
}

const getStatusClass = (status) => {
    const baseClasses = 'px-3 py-1 text-xs font-medium rounded-full'
    const statusClasses = {
        pending: 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/50',
        processing: 'bg-blue-900/30 text-blue-400 border border-blue-700/50',
        completed: 'bg-green-900/30 text-green-400 border border-green-700/50',
        cancelled: 'bg-red-900/30 text-red-400 border border-red-700/50'
    }
    return `${baseClasses} ${statusClasses[status] || statusClasses.pending}`
}

// Lifecycle
onMounted(async () => {
    await Promise.all([
        loadOrderStatuses(),
        loadOrders()
    ])
})
</script>

<style scoped>
.font-mono {
    font-family: 'JetBrains Mono', monospace;
}
</style>
