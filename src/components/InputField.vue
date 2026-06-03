<script setup lang="ts">
defineProps<{
  id: string
  label: string
  type: string
  placeholder?: string
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: string): void
}>()
</script>

<template>
  <div class="flex flex-col space-y-1.5">
    <label :for="id" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
      {{ label }}
    </label>

    <input
      :id="id"
      :type="type"
      :name="id"
      :placeholder="placeholder"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement)?.value)"
      class="block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-150 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
    />
  </div>
</template>
