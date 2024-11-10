<template>
    <div class="min-h-screen bg-black p-28">
        <!-- Header -->
        <div class="mb-8">
            <div class="flex flex-col space-y-4">
                <div class="flex justify-between items-center">
                    <div>
                        <h1
                            class="text-3xl font-bold text-white tracking-wider uppercase"
                        >
                            {{ typeLabels.plural }}
                        </h1>
                        <p class="text-zinc-400 mt-1 tracking-wide">
                            {{ description }}
                        </p>
                    </div>
                    <button
                        @click="openAddModal"
                        class="bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 transition-all duration-300 flex items-center space-x-2 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black"
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
                        <span>Add {{ typeLabels.singular }}</span>
                    </button>
                </div>

                <div class="flex gap-4">
                    <!-- Search -->
                    <div class="relative flex-1">
                        <input
                            type="text"
                            v-model="searchQuery"
                            class="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-lg pl-10 pr-4 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                            :placeholder="`Search ${typeLabels.plural.toLowerCase()}...`"
                        />
                        <svg
                            class="w-5 h-5 absolute left-3 top-3 text-zinc-400"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </div>

                    <!-- Sort Filter -->
                    <select
                        v-model="sortBy"
                        class="w-40 bg-zinc-900/50 border border-zinc-800 text-white rounded-lg px-4 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                    >
                        <option value="name">Name</option>
                        <option value="products">Products</option>
                        <option value="created">Created Date</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
                v-for="item in displayItems"
                :key="item.id"
                class="group bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
                @click="navigateToDetail(item)"
            >
                <!-- Header -->
                <div class="p-6 border-b border-zinc-800">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center space-x-4">
                            <div
                                class="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center"
                            >
                                <svg
                                    class="w-6 h-6 text-white"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path
                                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3
                                    class="text-lg font-medium text-white group-hover:text-purple-400 transition-colors duration-300"
                                >
                                    {{ item.name }}
                                </h3>
                                <p class="text-zinc-400 text-sm">
                                    /{{ item.path }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Stats -->
                <div class="px-6 py-4 bg-zinc-900/50">
                    <div class="grid gap-4">
                        <div class="text-center p-3 bg-zinc-800/50 rounded-lg">
                            <span class="text-sm text-zinc-400">Products</span>
                            <p class="mt-1 text-lg font-mono text-white">
                                {{ item.total_products || 0 }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div
                    class="px-6 py-4 border-t border-zinc-800 flex justify-end space-x-3"
                    @click.stop
                >
                    <button
                        @click="editItem(item)"
                        class="text-purple-400 hover:text-purple-300 transition-colors duration-200 text-sm flex items-center space-x-1"
                    >
                        <svg
                            class="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                        >
                            <path
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                        <span>Edit</span>
                    </button>
                    <button
                        @click="deleteItem(item)"
                        class="text-red-400 hover:text-red-300 transition-colors duration-200 text-sm flex items-center space-x-1"
                    >
                        <svg
                            class="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                        >
                            <path
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <div
            v-if="showModal"
            class="fixed inset-0 z-50 overflow-y-auto"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            <div
                class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
            >
                <!-- Background overlay -->
                <div
                    class="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
                    aria-hidden="true"
                ></div>

                <div
                    class="inline-block align-bottom bg-zinc-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                >
                    <div class="bg-zinc-900 px-4 pt-5 pb-4 sm:p-6">
                        <h3 class="text-lg font-medium text-white mb-4">
                            {{
                                editingItem
                                    ? `Edit ${typeLabels.singular}`
                                    : `Add New ${typeLabels.singular}`
                            }}
                        </h3>

                        <form @submit.prevent="saveItem" class="space-y-4">
                            <!-- Name -->
                            <div>
                                <label
                                    class="block text-sm font-medium text-zinc-400 mb-1"
                                >
                                    Name
                                </label>
                                <input
                                    type="text"
                                    v-model="form.name"
                                    class="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
                                    required
                                />
                            </div>
                        </form>
                    </div>
                    <div
                        class="bg-zinc-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
                    >
                        <button
                            @click="saveItem"
                            class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
                        >
                            {{
                                editingItem
                                    ? 'Save Changes'
                                    : `Add ${typeLabels.singular}`
                            }}
                        </button>
                        <button
                            @click="closeModal"
                            class="mt-3 w-full inline-flex justify-center rounded-lg border border-zinc-600 shadow-sm px-4 py-2 bg-black text-base font-medium text-zinc-300 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axiosInstance from '@/utils/axios'

// Props
const props = defineProps({
    type: {
        type: String,
        required: true,
        validator: value => ['categories', 'collections'].includes(value),
    },
})

// Router
const router = useRouter()

// Reactive State
const items = ref([])
const searchQuery = ref('')
const sortBy = ref('name')
const showModal = ref(false)
const editingItem = ref(null)
const form = ref({
    name: '',
})

// Computed Properties
const typeLabels = computed(() => ({
    singular: props.type === 'categories' ? 'Category' : 'Collection',
    plural: props.type === 'categories' ? 'Categories' : 'Collections',
}))

const description = computed(() => {
    return props.type === 'categories'
        ? 'Organize your products with dynamic categories'
        : 'Group your products into themed collections'
})

const displayItems = computed(() => {
    let filtered = items.value.filter(item =>
        item.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )

    filtered.sort((a, b) => {
        switch (sortBy.value) {
            case 'name':
                return a.name.localeCompare(b.name)
            case 'products':
                return (b.total_products || 0) - (a.total_products || 0)
            case 'created':
                return new Date(b.created_at) - new Date(a.created_at)
            default:
                return 0
        }
    })

    return filtered
})

// Methods
const fetchItems = async () => {
    try {
        const response = await axiosInstance.get(`/${props.type}`)
        if (response.data.status === 'success') {
            items.value = response.data.data
        }
    } catch (error) {
        console.error(`Error fetching ${props.type}:`, error)
    }
}

const generatePath = name => {
    return name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
}

const openAddModal = () => {
    editingItem.value = null
    form.value = {
        name: '',
    }
    showModal.value = true
}

const editItem = item => {
    editingItem.value = item
    form.value = {
        name: item.name,
    }
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    editingItem.value = null
    form.value = {
        name: '',
    }
}

const saveItem = async () => {
    try {
        // Generate path if not provided
        const itemData = {
            name: form.value.name,
            path: generatePath(form.value.name),
        }

        let response
        if (editingItem.value) {
            // Update existing item
            response = await axiosInstance.put(
                `/${props.type}/${editingItem.value.id}`,
                itemData,
            )
        } else {
            // Create new item
            response = await axiosInstance.post(`/${props.type}`, itemData)
        }

        if (response.data.status === 'success') {
            await fetchItems() // Refresh the list
            closeModal()
        }
    } catch (error) {
        const itemType = props.type === 'categories' ? 'category' : 'collection'
        console.error(`Error saving ${itemType}:`, error)
        if (error.response?.data?.message) {
            // Handle error - could add toast notification here
            console.error(error.response.data.message)
        }
    }
}

const deleteItem = async item => {
    const itemType = props.type === 'categories' ? 'category' : 'collection'
    const confirmMessage = `Are you sure you want to delete this ${itemType}? This action cannot be undone.`

    if (!confirm(confirmMessage)) {
        return
    }

    try {
        const response = await axiosInstance.delete(`/${props.type}/${item.id}`)

        if (response.data.status === 'success') {
            await fetchItems() // Refresh the list
        }
    } catch (error) {
        console.error(`Error deleting ${itemType}:`, error)
        if (error.response?.data?.message) {
            // Handle error - could add toast notification here
            console.error(error.response.data.message)
        }
    }
}

const navigateToDetail = item => {
    router.push(`/admin/${props.type}/${item.path}`)
}

// Watchers
watch(
    () => form.value.name,
    newName => {
        // Only auto-generate path for new items
        if (!editingItem.value) {
            form.value.path = generatePath(newName)
        }
    },
)

watch(
    () => props.type,
    async () => {
        await fetchItems()
    },
)

// Lifecycle Hooks
onMounted(() => {
    fetchItems()
})
</script>
