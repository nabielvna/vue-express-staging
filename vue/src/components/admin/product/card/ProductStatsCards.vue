<template>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
            v-for="config in cardConfigs"
            :key="config.title"
            :title="config.title"
            :value="config.value"
            :color="config.color"
        >
            <template #icon>
                <svg
                    class="w-6 h-6"
                    :class="`text-${config.color}-500`"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                >
                    <path
                        :d="config.icon"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </template>
        </StatsCard>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import StatsCard from './StatsCard.vue'

const props = defineProps({
    products: {
        // Ubah nama prop dari filteredProducts ke products
        type: Array,
        required: true,
    },
})

const statusCounts = computed(() => {
    return props.products.reduce((acc, product) => {
        const status = getOverallStatus(product.sizeStock)
        acc[status] = (acc[status] || 0) + 1
        return acc
    }, {})
})

const getOverallStatus = sizeStock => {
    if (!sizeStock) return 'out_of_stock'

    const totalStock = Object.values(sizeStock).reduce(
        (sum, stock) => sum + stock,
        0,
    )
    if (totalStock === 0) return 'out_of_stock'

    const hasLowStock = Object.values(sizeStock).some(
        stock => stock > 0 && stock <= 5,
    )
    return hasLowStock ? 'low_stock' : 'in_stock'
}

const cardConfigs = computed(() => [
    // Ubah menjadi computed
    {
        title: 'Total Products',
        value: props.products.length,
        color: 'purple',
        icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    },
    {
        title: 'In Stock',
        value: statusCounts.value.in_stock || 0,
        color: 'emerald',
        icon: 'M5 13l4 4L19 7',
    },
    {
        title: 'Low Stock',
        value: statusCounts.value.low_stock || 0,
        color: 'yellow',
        icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    },
    {
        title: 'Out of Stock',
        value: statusCounts.value.out_of_stock || 0,
        color: 'red',
        icon: 'M6 18L18 6M6 6l12 12',
    },
])
</script>
