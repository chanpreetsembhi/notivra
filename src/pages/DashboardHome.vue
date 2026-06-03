<script setup lang="ts">
import Button from '@/components/Button.vue'
import { BookOpen } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'toggle-sidebar'): void
}>()
</script>

<template>
  <div class="flex h-full flex-col items-center justify-center px-6 text-center select-none">
    <div
      class="mb-6 flex size-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-500/10"
    >
      <BookOpen class="size-7 text-indigo-600 dark:text-indigo-400" />
    </div>

    <h2 class="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
      Pick a subject to begin
    </h2>
    <p class="max-w-xs text-sm leading-relaxed text-slate-400 dark:text-slate-500">
      Browse subjects from the sidebar and start reading notes, summaries, and key points.
    </p>

    <div class="mt-8 lg:hidden">
      <Button varient="primary" label="Browse Subjects" @click="emit('toggle-sidebar')" />
    </div>
  </div>
</template>
