<script setup lang="ts">
import Button from '@/components/Button.vue'
import Title from '@/components/Title.vue'

const emit = defineEmits<{
  (e: 'toggle-sidebar'): void
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full text-center px-5">
    <Title>Welcome to NEP Support Hub</Title>
    <p class="text-gray-500 mt-4 max-w-md">
      Select a subject from the sidebar to explore topics and educational materials.
    </p>
    <div class="mt-8 text-sm text-gray-400">
      <p>👈 Choose a subject to get started</p>
      <Button
        varient="primary"
        label="Get Started"
        class="mt-3 block lg:hidden"
        @click="emit('toggle-sidebar')"
      />
    </div>
  </div>
</template>
