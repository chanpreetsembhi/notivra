<script setup lang="ts">
import { ref } from 'vue'
import Header from '@/components/Header.vue'
import Sidebar from '@/components/Sidebar.vue'

const open = ref<boolean>(false)

const toggleSidebar = () => {
  open.value = !open.value
}
</script>

<template>
  <div class="flex flex-col h-svh">
    <Header :sidebar-open="open" @toggle-sidebar="toggleSidebar" />
    <main class="flex overflow-hidden h-full">
      <Sidebar :open="open" @close="open = false" />
      <section class="w-full lg:w-4/5 overflow-y-auto p-5 relative">
        <RouterView @toggle-sidebar="toggleSidebar" />
      </section>
    </main>
  </div>
</template>
