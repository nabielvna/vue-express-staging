<template>
    <div>
        <Transition name="fade">
            <div
                v-if="isLoading"
                class="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center overflow-hidden"
                @wheel.prevent
                @touchmove.prevent
                @scroll.prevent
                @contextmenu.prevent
                @selectstart.prevent
            >
                <!-- Scattered Background Text -->
                <div
                    class="absolute inset-0 overflow-hidden select-none pointer-events-none opacity-30"
                >
                    <div
                        v-for="n in 50"
                        :key="n"
                        class="absolute font-bold tracking-wider"
                        :style="{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            transform: `rotate(${Math.random() * 360}deg) scale(${0.8 + Math.random() * 1.2}) skew(${-15 + Math.random() * 30}deg)`,
                            fontSize: `${1.2 + Math.random() * 2}rem`,
                            opacity: 0.1 + Math.random() * 0.4,
                            color: '#808080',
                            textShadow: 'none',
                            letterSpacing: `${Math.random() * 8}px`,
                            fontStyle: n % 4 === 0 ? 'italic' : 'normal',
                            fontWeight: Math.random() > 0.5 ? 800 : 600,
                        }"
                    >
                        GALLERY
                    </div>
                </div>

                <!-- Logo Container -->
                <div class="relative select-none pointer-events-none z-10">
                    <img
                        src="/catharsis.png"
                        alt="Catharsis Logo"
                        class="w-96 h-96 object-contain"
                        :class="{ 'animate-pulse': true }"
                        draggable="false"
                    />
                </div>
            </div>
        </Transition>

        <!-- Main Content -->
        <div :class="{ 'opacity-0': isLoading }">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isLoading = ref(true)

// Prevent scroll and keyboard events
const preventDefaultBehavior = e => {
    if (isLoading.value) {
        e.preventDefault()
    }
}

// Setup event listeners
onMounted(() => {
    // Prevent scroll
    document.body.style.overflow = 'hidden'
    document.body.style.height = '100vh'
    document.body.style.touchAction = 'none'

    // Prevent keyboard shortcuts
    window.addEventListener('keydown', preventDefaultBehavior)
    window.addEventListener('keyup', preventDefaultBehavior)

    // Start loading sequence
    initializeLoading()
})

// Cleanup
onUnmounted(() => {
    document.body.style.overflow = ''
    document.body.style.height = ''
    document.body.style.touchAction = ''
    window.removeEventListener('keydown', preventDefaultBehavior)
    window.removeEventListener('keyup', preventDefaultBehavior)
})

// Check logo loading
const checkLogoLoaded = () => {
    return new Promise(resolve => {
        const logo = new Image()
        logo.src = '/catharsis.png'
        if (logo.complete) {
            resolve()
        } else {
            logo.onload = () => resolve()
            logo.onerror = () => resolve()
        }
    })
}

// Check fonts
const checkFontsLoaded = async () => {
    try {
        await document.fonts.ready
        return true
    } catch {
        return true
    }
}

// Initialize loading sequence
const initializeLoading = async () => {
    await Promise.all([checkLogoLoaded(), checkFontsLoaded()])

    // Add small delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 800))

    // Enable interactions and hide loading screen
    document.body.style.overflow = ''
    document.body.style.height = ''
    document.body.style.touchAction = ''
    isLoading.value = false
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.6s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Prevent all image interactions */
img {
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-select: none;
    -webkit-user-select: none;
}
</style>
