<template>
    <div class="min-h-screen bg-black p-28">
        <!-- Header section remains the same -->
        <div class="mb-8">
            <div class="flex justify-between items-center">
                <div>
                    <h1
                        class="text-3xl font-bold text-white tracking-wider uppercase"
                    >
                        Orders
                    </h1>
                    <p class="text-zinc-400 mt-1 tracking-wide">
                        Manage and track your customer orders
                    </p>
                </div>
                <div class="flex space-x-4">
                    <!-- Export Button -->
                    <button
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
                    <!-- Add Order Button -->
                    <button
                        class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 flex items-center"
                    >
                        <svg
                            class="w-4 h-4 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                        >
                            <path
                                d="M12 4v16m8-8H4"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                        New Order
                    </button>
                </div>
            </div>

            <!-- Filters section remains the same -->
            <div class="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <!-- ... filters remain the same ... -->
            </div>
        </div>

        <!-- Orders Table -->
        <div class="bg-zinc-900 rounded-lg border border-zinc-800">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-zinc-800">
                    <thead>
                        <tr class="bg-zinc-900/50">
                            <th
                                class="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider"
                            >
                                Order ID
                            </th>
                            <th
                                class="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider"
                            >
                                Customer
                            </th>
                            <th
                                class="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider"
                            >
                                Status
                            </th>
                            <th
                                class="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider"
                            >
                                Date
                            </th>
                            <th
                                class="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider"
                            >
                                Total
                            </th>
                            <th
                                class="px-6 py-4 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-zinc-800">
                        <tr
                            v-for="order in paginatedOrders"
                            :key="order.id"
                            class="hover:bg-zinc-800/50 transition-colors duration-200"
                        >
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span
                                    class="text-sm font-mono text-purple-400 font-medium"
                                    >#{{ order.id }}</span
                                >
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div
                                        class="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white text-sm font-medium"
                                    >
                                        {{ getInitials(order.customer) }}
                                    </div>
                                    <div class="ml-3">
                                        <div
                                            class="text-sm font-medium text-white"
                                        >
                                            {{ order.customer }}
                                        </div>
                                        <div class="text-sm text-zinc-400">
                                            {{ order.email }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getStatusClass(order.status)">
                                    {{ formatStatus(order.status) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-zinc-300">
                                    {{ formatDate(order.date) }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-mono text-white">
                                    Rp{{ order.total.toFixed(3) }}
                                </div>
                            </td>
                            <td
                                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3"
                            >
                                <button
                                    class="text-purple-400 hover:text-purple-300 transition-colors duration-200"
                                >
                                    View
                                </button>
                                <button
                                    class="text-zinc-400 hover:text-white transition-colors duration-200"
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Modified Pagination -->
            <div class="px-6 py-4 border-t border-zinc-800">
                <div class="flex items-center justify-between">
                    <div class="text-sm text-zinc-400">
                        Showing
                        <span class="font-medium text-white">{{
                            paginationStart
                        }}</span>
                        to
                        <span class="font-medium text-white">{{
                            paginationEnd
                        }}</span>
                        of
                        <span class="font-medium text-white">{{
                            totalItems
                        }}</span>
                        results
                    </div>
                    <div class="flex space-x-2">
                        <button
                            @click="previousPage"
                            :disabled="currentPage === 1"
                            class="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <div class="flex space-x-1">
                            <button
                                v-for="page in displayedPages"
                                :key="page"
                                @click="currentPage = page"
                                class="px-3 py-1 text-sm rounded-md"
                                :class="
                                    page === currentPage
                                        ? 'bg-purple-600 text-white'
                                        : 'text-zinc-400 hover:text-white'
                                "
                            >
                                {{ page }}
                            </button>
                        </div>
                        <button
                            @click="nextPage"
                            :disabled="currentPage === totalPages"
                            class="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ordersData } from './MenuConfig'

// Pagination
const itemsPerPage = 4
const currentPage = ref(1)

// Computed properties for pagination
const totalItems = computed(() => ordersData.length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage))

const paginatedOrders = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return ordersData.slice(start, end)
})

const paginationStart = computed(() => {
    return (currentPage.value - 1) * itemsPerPage + 1
})

const paginationEnd = computed(() => {
    const end = currentPage.value * itemsPerPage
    return end > totalItems.value ? totalItems.value : end
})

const displayedPages = computed(() => {
    const pages = []
    const maxDisplayed = 5
    let start = Math.max(1, currentPage.value - Math.floor(maxDisplayed / 2))
    let end = Math.min(totalPages.value, start + maxDisplayed - 1)

    if (end - start + 1 < maxDisplayed) {
        start = Math.max(1, end - maxDisplayed + 1)
    }

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }
    return pages
})

// Navigation methods
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
    }
}

const previousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
    }
}

// Existing utility functions
const getInitials = name => {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
}

const formatDate = date => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

const formatStatus = status => {
    return status.charAt(0).toUpperCase() + status.slice(1)
}

const getStatusClass = status => {
    const baseClasses = 'px-3 py-1 text-xs font-medium rounded-full'
    const statusClasses = {
        pending: 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/50',
        processing: 'bg-blue-900/30 text-blue-400 border border-blue-700/50',
        completed: 'bg-green-900/30 text-green-400 border border-green-700/50',
        cancelled: 'bg-red-900/30 text-red-400 border border-red-700/50',
    }
    return `${baseClasses} ${statusClasses[status]}`
}
</script>

<style scoped>
.font-mono {
    font-family: 'JetBrains Mono', monospace;
}
</style>
