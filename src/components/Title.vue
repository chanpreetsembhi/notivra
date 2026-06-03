<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    title: string
    description?: string
    count?: string | number
    countLabel?: string
  }>(),
  {
    description: '',
    count: '',
    countLabel: '',
  },
)
</script>

<template>
  <div class="border-b border-slate-200 dark:border-slate-700 pb-5 mb-8 text-center md:text-start">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div class="min-w-0">
        <span
          class="mb-2 inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
        >
          {{ label }}
        </span>

        <h1
          class="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100"
        >
          {{ title }}
        </h1>

        <p
          v-if="description"
          class="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400"
        >
          {{ description }}
        </p>
      </div>

      <div v-if="count !== ''" class="shrink-0 text-center sm:text-right">
        <div class="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {{ count }}
        </div>
        <div
          v-if="countLabel"
          class="text-[11px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400"
        >
          {{ countLabel }}
        </div>
      </div>
    </div>
  </div>
</template>
