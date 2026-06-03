<script setup lang="ts">
import { ref } from 'vue'
import Header from '@/components/Header.vue'
import Sidebar from '@/components/Sidebar.vue'

const open = ref<boolean>(false)
const toggleSidebar = () => (open.value = !open.value)
</script>

<template>
  <div class="flex h-svh flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <Header :sidebar-open="open" @toggle-sidebar="toggleSidebar" />
    <main class="flex flex-1 overflow-hidden">
      <Sidebar :open="open" @close="open = false" />
      <section class="flex-1 overflow-y-auto bg-white dark:bg-slate-900">
        <RouterView @toggle-sidebar="toggleSidebar" />
      </section>
    </main>
  </div>
</template>
