<template>
    <section id="hero1" class="relative">
        <!-- Mobile hero -->
        <div
            class="h-screen bg-cover bg-center bg-[url('/catharsis-model2.png')] md:bg-[url('/catharsis-model3.png')] lg:hidden"
        ></div>

        <!-- Desktop hero -->
        <div class="hidden lg:flex h-screen relative group/container">
            <div
                v-for="(image, index) in images"
                :key="index"
                class="flex-1 bg-cover bg-center transition-all duration-300 ease-in-out hover:flex-[1.5] group relative"
                :class="{ 'border-x-2': index === 1 }"
                :style="{ backgroundImage: `url(${image})` }"
            >
                <div
                    class="w-full h-full transition-colors duration-300 group-hover/container:bg-black/60 group-hover/container:backdrop-blur-[0.5px] group-hover:!bg-transparent group-hover:!backdrop-blur-none"
                ></div>
            </div>
        </div>

        <!-- Scroll Indicator -->
        <div
            class="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
            :class="{ 'opacity-0': !showScrollIndicator }"
            @mouseenter="pauseAnimation = true"
            @mouseleave="pauseAnimation = false"
        >
            <span
                class="text-white text-sm font-light tracking-wider uppercase opacity-80"
                :class="{ 'animate-fade-in': !pauseAnimation }"
            >
                Scroll
            </span>

            <div
                @click="scrollToNextSection"
                class="relative cursor-pointer group"
            >
                <div
                    class="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center p-1"
                >
                    <div
                        class="w-1 h-1 bg-white rounded-full"
                        :class="{ 'animate-scroll-down': !pauseAnimation }"
                    ></div>
                </div>

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="absolute -bottom-7 left-1/2 -translate-x-1/2 text-white/60 transition-transform duration-300 group-hover:translate-y-1"
                >
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const images = [
    '/catharsis-model2.png',
    '/catharsis-model3.png',
    '/catharsis-model4.png',
]

const showScrollIndicator = ref(true)
const pauseAnimation = ref(false)
let scrollTimeout

const handleScroll = () => {
    showScrollIndicator.value = false
    clearTimeout(scrollTimeout)

    scrollTimeout = setTimeout(() => {
        if (window.scrollY < 100) {
            showScrollIndicator.value = true
        }
    }, 1000)
}

const scrollToNextSection = () => {
    const nextSection = document.getElementById('card1')
    if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' })
    }
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.animate-scroll-down {
    animation: scrollDown 1.5s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}

.animate-fade-in {
    animation: fadeIn 2s ease-in-out infinite;
}

@keyframes scrollDown {
    0% {
        transform: translateY(0);
        opacity: 1;
    }
    75% {
        transform: translateY(200%);
        opacity: 0;
    }
    76% {
        transform: translateY(-200%);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes fadeIn {
    0%,
    100% {
        opacity: 0.4;
    }
    50% {
        opacity: 1;
    }
}
</style>
