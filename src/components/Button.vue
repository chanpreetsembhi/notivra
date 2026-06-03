<script setup lang="ts">
defineProps<{
  label: string
  varient: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}>()
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',

      // Primary
      !disabled &&
        varient === 'primary' &&
        'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-400 shadow-sm shadow-indigo-600/25 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:shadow-indigo-500/20 dark:focus-visible:ring-indigo-400',

      // Secondary
      !disabled &&
        varient === 'secondary' &&
        'bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:ring-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:focus-visible:ring-slate-600',

      // Danger
      !disabled &&
        varient === 'danger' &&
        'bg-red-50 text-red-600 hover:bg-red-100 focus-visible:ring-red-300 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 dark:focus-visible:ring-red-500/40',

      // Disabled
      disabled &&
        '!bg-slate-100 !text-slate-400 !cursor-not-allowed dark:!bg-slate-800 dark:!text-slate-600',

      // Ring offset color
      'focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900',
    ]"
  >
    {{ label }}
  </button>
</template>
