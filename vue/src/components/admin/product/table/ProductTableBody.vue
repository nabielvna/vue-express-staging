<template>
    <tbody class="divide-y divide-zinc-800">
        <tr
            v-for="product in products"
            :key="product.id"
            class="hover:bg-zinc-800/50 transition-colors duration-200"
        >
            <!-- Product Info -->
            <td class="px-6 py-4">
                <div class="flex items-center">
                    <div
                        class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-zinc-700"
                    >
                        <img
                            :src="product.image"
                            class="h-16 w-16 object-cover"
                            :alt="product.name"
                        />
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-white">
                            {{ product.name }}
                        </div>
                        <div class="text-sm text-zinc-400">
                            Last updated: {{ formatDate(product.lastUpdated) }}
                        </div>
                        <div
                            class="text-sm text-zinc-500 mt-2 whitespace-pre-line"
                        >
                            <div v-if="!expandedProducts[product.id]">
                                {{ truncateText(product.description) }}
                                <button
                                    v-if="product.description?.length > 35"
                                    @click="toggleDescription(product.id)"
                                    class="text-emerald-400 hover:text-emerald-300 text-xs ml-1 transition-colors duration-200"
                                >
                                    Lihat Selengkapnya
                                </button>
                            </div>
                            <div v-else>
                                {{ product.description }}
                                <button
                                    @click="toggleDescription(product.id)"
                                    class="text-emerald-400 hover:text-emerald-300 text-xs ml-1 transition-colors duration-200"
                                >
                                    Lihat Lebih Sedikit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </td>

            <!-- Price -->
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-mono text-white">
                    Rp{{ formatPrice(product.price) }}
                </div>
            </td>

            <!-- Category -->
            <td class="px-6 py-4 whitespace-nowrap">
                <span
                    class="px-3 py-1 text-xs font-medium rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700"
                >
                    {{ formatCategory(product.category) }}
                </span>
            </td>

            <!-- Status -->
            <td class="px-6 py-4 whitespace-nowrap">
                <span
                    :class="getStatusClass(getOverallStatus(product.sizeStock))"
                >
                    {{ formatStatus(getOverallStatus(product.sizeStock)) }}
                </span>
            </td>

            <!-- Stock -->
            <td class="px-6 py-4 whitespace-nowrap">
                <button
                    @click="$emit('view-stock', product)"
                    class="inline-flex items-center px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all duration-200 group"
                >
                    <span
                        class="text-sm font-mono text-zinc-300 group-hover:text-white"
                    >
                        {{ getTotalStock(product.sizeStock) }}
                    </span>
                    <svg
                        class="w-4 h-4 ml-1.5 text-zinc-400 group-hover:text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                    >
                        <path
                            d="M9 5l7 7-7 7"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </button>
            </td>

            <!-- Collection -->
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-zinc-300">
                    {{ getCollectionName(product.collection) }}
                </div>
            </td>

            <!-- Actions -->
            <td class="px-6 py-4 whitespace-nowrap text-right space-x-3">
                <button
                    @click="$emit('edit', product)"
                    class="text-purple-400 hover:text-purple-300 transition-colors duration-200 text-sm font-medium"
                >
                    Edit
                </button>
                <button
                    @click="$emit('delete', product.id)"
                    class="text-red-400 hover:text-red-300 transition-colors duration-200 text-sm font-medium"
                >
                    Delete
                </button>
            </td>
        </tr>
    </tbody>
</template>

<script setup>
import { ref } from 'vue'
import { collectionsData } from '@/views/admin/MenuConfig'


defineProps({
    products: {
        type: Array,
        required: true,
    },
})

defineEmits(['edit', 'delete', 'view-stock', 'add-product'])

// State for expanded descriptions
const expandedProducts = ref({})

// Toggle description visibility
const toggleDescription = productId => {
    expandedProducts.value[productId] = !expandedProducts.value[productId]
}

// Truncate text function
const truncateText = text => {
    if (!text) return ''
    return text.length > 35 ? text.slice(0, 35) + '...' : text
}

// Utility functions
const formatPrice = price => {
    return new Intl.NumberFormat('id-ID').format(price)
}

const formatDate = date => {
    return new Date(date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

const formatCategory = category => {
    return category
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

const formatStatus = status => {
    return status
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

const getStatusClass = status => {
    const baseClasses = 'px-3 py-1 text-xs font-medium rounded-full border'
    const statusClasses = {
        in_stock: 'bg-emerald-900/30 text-emerald-400 border-emerald-700/50',
        low_stock: 'bg-yellow-900/30 text-yellow-400 border-yellow-700/50',
        out_of_stock: 'bg-red-900/30 text-red-400 border-red-700/50',
    }
    return `${baseClasses} ${statusClasses[status]}`
}

const getTotalStock = sizeStock => {
    return Object.values(sizeStock).reduce((sum, current) => sum + current, 0)
}

const getOverallStatus = sizeStock => {
    const totalStock = getTotalStock(sizeStock)
    if (totalStock === 0) return 'out_of_stock'
    if (Object.values(sizeStock).some(stock => stock > 0 && stock <= 5))
        return 'low_stock'
    return 'in_stock'
}

const getCollectionName = collectionId => {
    const collection = collectionsData.find(c => c.id === collectionId)
    return collection ? collection.name : '-'
}
</script>

<style scoped>
/* Hover effect for buttons */
button {
    transition: all 0.2s ease-in-out;
}

/* Custom hover effect for table rows */
tr:hover button.text-purple-400 {
    color: rgb(192 132 252); /* text-purple-300 */
}

tr:hover button.text-red-400 {
    color: rgb(248 113 113); /* text-red-300 */
}

/* Font settings */
.font-mono {
    font-family: 'JetBrains Mono', monospace;
}

/* Status badge hover effect */
[class*='rounded-full']:hover {
    filter: brightness(1.1);
    transition: filter 0.2s ease-in-out;
}
</style>
