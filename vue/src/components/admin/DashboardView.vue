<template>
    <div class="min-h-screen bg-black p-28">
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
                v-for="stat in statsData"
                :key="stat.title"
                class="relative overflow-hidden bg-zinc-900 rounded-lg border border-zinc-800 hover:border-purple-500 transition-all duration-300"
            >
                <div class="p-6">
                    <div class="flex items-center">
                        <div
                            class="p-3 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800"
                        >
                            <svg
                                class="w-6 h-6 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path
                                    :d="stat.svgPath"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </div>
                        <div class="ml-4">
                            <h3
                                class="text-zinc-400 text-sm font-medium uppercase tracking-wider"
                            >
                                {{ stat.title }}
                            </h3>
                            <p
                                class="text-2xl font-bold text-white mt-1 font-mono"
                            >
                                {{ stat.value }}
                            </p>
                            <p
                                class="text-sm font-medium flex items-center mt-2"
                                :class="
                                    stat.trend > 0
                                        ? 'text-green-400'
                                        : 'text-red-400'
                                "
                            >
                                <svg
                                    class="w-4 h-4 mr-1"
                                    :class="
                                        stat.trend > 0
                                            ? 'rotate-0'
                                            : 'rotate-180'
                                    "
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                {{ Math.abs(stat.trend) }}% from last month
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent Activity -->
        <div class="mt-8 bg-zinc-900 rounded-lg border border-zinc-800">
            <div class="px-6 py-4 border-b border-zinc-800">
                <div class="flex items-center justify-between">
                    <h3
                        class="text-lg font-bold text-white tracking-wider uppercase"
                    >
                        Recent Activity
                    </h3>
                    <button
                        class="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
                    >
                        View All
                    </button>
                </div>
            </div>
            <div class="p-6">
                <div class="space-y-6">
                    <div
                        v-for="activity in recentActivities"
                        :key="activity.id"
                        class="flex items-start space-x-4 group"
                    >
                        <div class="flex-shrink-0">
                            <div
                                class="p-2 bg-zinc-800 rounded-lg group-hover:bg-purple-900/30 transition-colors duration-200"
                            >
                                <svg
                                    class="w-5 h-5 text-purple-400"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path
                                        :d="activity.svgPath"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div class="flex-1">
                            <p class="text-sm font-medium text-white">
                                {{ activity.description }}
                            </p>
                            <p class="text-sm text-zinc-400 mt-1">
                                {{ activity.time }}
                            </p>
                        </div>
                        <button
                            class="text-zinc-500 hover:text-purple-400 transition-colors duration-200"
                        >
                            <svg
                                class="w-5 h-5"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <path
                                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Stats Preview -->
        <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Weekly Sales Chart -->
            <div class="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
                <div class="flex items-center justify-between mb-6">
                    <h3
                        class="text-lg font-bold text-white tracking-wider uppercase"
                    >
                        Weekly Sales
                    </h3>
                    <div class="flex space-x-2">
                        <button
                            class="px-3 py-1 text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors duration-200"
                        >
                            This Week
                        </button>
                        <button
                            class="px-3 py-1 text-xs font-medium text-zinc-400 hover:text-purple-300 transition-colors duration-200"
                        >
                            Last Week
                        </button>
                    </div>
                </div>
                <div class="h-64 flex items-center justify-center">
                    <p class="text-zinc-500">Chart placeholder</p>
                </div>
            </div>

            <!-- Top Products -->
            <div class="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
                <div class="flex items-center justify-between mb-6">
                    <h3
                        class="text-lg font-bold text-white tracking-wider uppercase"
                    >
                        Top Products
                    </h3>
                    <button
                        class="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
                    >
                        View All
                    </button>
                </div>
                <div class="space-y-4">
                    <div
                        v-for="i in 3"
                        :key="i"
                        class="flex items-center justify-between group"
                    >
                        <div class="flex items-center space-x-4">
                            <div class="w-12 h-12 bg-zinc-800 rounded-lg"></div>
                            <div>
                                <h4
                                    class="text-sm font-medium text-white group-hover:text-purple-400 transition-colors duration-200"
                                >
                                    DYSTOPIAN - Spectrum #{{ i }}
                                </h4>
                                <p class="text-xs text-zinc-400">
                                    {{ 150 + i * 50 }} sales
                                </p>
                            </div>
                        </div>
                        <p class="text-sm font-mono text-white">
                            ${{ (299 + i * 100).toFixed(2) }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { statsData, recentActivities } from './MenuConfig'
</script>

<style scoped>
.font-mono {
    font-family: 'JetBrains Mono', monospace;
}
</style>
