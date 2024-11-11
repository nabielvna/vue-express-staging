<template>
    <div
        class="bg-gradient-to-r from-zinc-900/50 to-zinc-800/30 rounded-xl border border-zinc-800 p-6 mb-8"
    >
        <div
            class="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
            <!-- Search -->
            <SearchInput v-model="searchLocal" />

            <!-- Filters -->
            <div class="flex flex-wrap gap-4">
                <FilterSelect
                    v-model="categoryLocal"
                    :options="categories"
                    placeholder="All Categories"
                />

                <FilterSelect
                    v-model="collectionLocal"
                    :options="collectionOptions"
                    placeholder="All Collections"
                />

                <FilterSelect
                    v-model="statusLocal"
                    :options="statusOptions"
                    placeholder="All Status"
                />

                <button
                    @click="$emit('add-product')"
                    class="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:from-purple-500 hover:to-purple-600 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                >
                    <svg
                        class="w-5 h-5"
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
                    <span>Add Product</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { collectionsData } from '@/views/admin/MenuConfig'
import SearchInput from './SearchInput.vue'
import FilterSelect from './FilterSelect.vue'

const statusOptions = [
    { value: 'in_stock', label: 'In Stock' },
    { value: 'low_stock', label: 'Low Stock' },
    { value: 'out_of_stock', label: 'Out of Stock' },
]

const collectionOptions = computed(() => {
    return collectionsData.map(collection => ({
        value: collection.id.toString(),
        label: collection.name,
    }))
})

const props = defineProps({
    search: {
        type: String,
        default: '',
    },
    category: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        default: '',
    },
    collection: {
        type: String,
        default: '',
    },
    categories: {
        type: Array,
        required: true,
    },
})

const emit = defineEmits([
    'update:search',
    'update:category',
    'update:status',
    'update:collection',
    'add-product',
])

// Local state
const searchLocal = ref(props.search)
const categoryLocal = ref(props.category)
const statusLocal = ref(props.status)
const collectionLocal = ref(props.collection)

// Watch for changes
watch(searchLocal, val => emit('update:search', val))
watch(categoryLocal, val => emit('update:category', val))
watch(statusLocal, val => emit('update:status', val))
watch(collectionLocal, val => emit('update:collection', val))

// Watch for prop changes
watch(
    () => props.search,
    val => (searchLocal.value = val),
)
watch(
    () => props.category,
    val => (categoryLocal.value = val),
)
watch(
    () => props.status,
    val => (statusLocal.value = val),
)
watch(
    () => props.collection,
    val => (collectionLocal.value = val),
)
</script>
