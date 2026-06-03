<script setup lang="ts">
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { X } from 'lucide-vue-next'

defineProps<{
  isOpen: boolean
  title?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-50" @close="emit('close')">
      <!-- Overlay -->
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-black/60" />
      </TransitionChild>

      <!-- Panel wrapper -->
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative w-full max-w-md transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all dark:bg-slate-900"
            >
              <!-- Header -->
              <div
                v-if="title"
                class="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800"
              >
                <DialogTitle
                  as="h3"
                  class="text-lg font-semibold text-slate-900 dark:text-slate-100"
                >
                  {{ title }}
                </DialogTitle>

                <button
                  type="button"
                  @click="emit('close')"
                  class="flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                  aria-label="Close modal"
                >
                  <X class="size-4" />
                </button>
              </div>

              <!-- Close button (if no title) -->
              <button
                v-else
                type="button"
                @click="emit('close')"
                class="absolute right-4 top-4 flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                aria-label="Close modal"
              >
                <X class="size-4" />
              </button>

              <!-- Body -->
              <div class="p-6">
                <slot />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
