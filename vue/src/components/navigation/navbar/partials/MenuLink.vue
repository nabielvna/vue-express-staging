<!-- MenuLink.vue -->
<template>
    <div class="relative" @mouseenter="handleMouseEnter">
        <RouterLink
            :to="path"
            class="text-gray-200 hover:text-white px-4 lg:px-6 py-2 rounded-md text-base font-bold tracking-[0.25em] transition-colors duration-200 block"
        >
            {{ text }}
        </RouterLink>
    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
    text: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
})

const emit = defineEmits(['mouseenter', 'openMenu'])

const handleMouseEnter = () => {
    emit('mouseenter')
    emit('openMenu')
}
</script>
