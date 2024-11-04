<template>
    <div class="hidden lg:block">
        <!-- Search Button -->
        <button
            @click="updateSearch(true)"
            class="text-gray-200 hover:text-white rounded-full hover:bg-white/10 relative flex items-center gap-2 p-3"
            :class="{ 'text-gray-300': isSearchOpen }"
        >
            <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
        </button>

        <!-- Search Modal -->
        <div
            v-if="isSearchOpen"
            class="fixed inset-0 bg-black/40 backdrop-blur-md flex items-start justify-center pt-20 z-50"
            @click="closeSearch"
        >
            <div
                @click.stop
                class="w-full max-w-2xl mx-4 bg-black/80 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
            >
                <!-- Search Input -->
                <div class="relative border-b border-white/10">
                    <input
                        ref="searchInput"
                        type="text"
                        v-model="searchQuery"
                        placeholder="Search..."
                        class="w-full bg-transparent text-white placeholder-gray-400 text-lg pl-12 pr-16 py-4 focus:outline-none"
                    />
                    <svg
                        class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>

                    <!-- Keyboard Shortcut Indicator -->
                    <div
                        class="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-1"
                    >
                        <kbd
                            class="px-2 py-1 text-xs text-gray-400 bg-white/5 border border-white/10 rounded"
                        >
                            <span class="text-xs">⌘</span>
                            K
                        </kbd>
                    </div>
                </div>

                <!-- Results Area (when there's a query) -->
                <div v-if="searchQuery" class="max-h-[60vh] overflow-y-auto">
                    <!-- No Results State -->
                    <div v-if="searchQuery.length > 0" class="py-8 text-center">
                        <p class="text-gray-400 text-sm">
                            No results found for "{{ searchQuery }}"
                        </p>
                    </div>
                </div>

                <!-- Empty State (when no query) -->
                <div v-else class="px-4 py-6">
                    <div class="text-gray-400 text-sm space-y-2">
                        <p>Recent Searches</p>
                        <p class="text-gray-500 text-xs italic">
                            No recent searches
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
    isSearchOpen: Boolean,
    isCartOpen: Boolean,
})

const emit = defineEmits(['updateSearchState', 'updateCartState'])

const searchQuery = ref('')
const searchInput = ref(null)

watch(
    () => props.isSearchOpen,
    newValue => {
        if (newValue) {
            if (props.isCartOpen) {
                emit('updateCartState', false)
            }
            setTimeout(() => {
                searchInput.value?.focus()
            }, 100)
        } else {
            searchQuery.value = ''
        }
    },
)

const updateSearch = state => {
    if (props.isCartOpen) {
        emit('updateCartState', false)
    }
    emit('updateSearchState', state)
}

const handleKeydown = e => {
    if (e.key === 'Escape' && props.isSearchOpen) {
        closeSearch()
        return
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (props.isCartOpen) {
            emit('updateCartState', false)
        }
        updateSearch(!props.isSearchOpen)
    }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

const closeSearch = () => {
    emit('updateSearchState', false)
    searchQuery.value = ''
}
</script>
