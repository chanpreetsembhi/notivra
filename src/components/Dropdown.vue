<script setup lang="ts">
import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import { Check, ChevronsUpDown } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    label: string
    items: any[]
    displayKey?: string
    valueKey?: string
    placeholder?: string
  }>(),
  {
    placeholder: 'Select an option',
  },
)

const selectedItem = defineModel<any>()
</script>

<template>
  <Listbox v-model="selectedItem">
    <ListboxLabel
      as="div"
      class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
    >
      {{ label }}
    </ListboxLabel>

    <div class="relative">
      <ListboxButton
        class="relative w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-3.5 pr-10 text-left text-sm text-slate-700 shadow-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus-visible:ring-offset-slate-900"
      >
        <span class="block truncate">
          {{ (displayKey ? selectedItem?.[displayKey] : selectedItem?.subject) ?? placeholder }}
        </span>

        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <ChevronsUpDown class="size-4 text-slate-400 dark:text-slate-500" aria-hidden="true" />
        </span>
      </ListboxButton>

      <transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-1"
      >
        <ListboxOptions
          class="absolute left-0 top-full z-50 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg focus:outline-none dark:border-slate-700 dark:bg-slate-900"
        >
          <ListboxOption
            v-for="(item, index) in items"
            :key="valueKey ? item[valueKey] : item._id || item.name || index"
            v-slot="{ active, selected }"
            :value="item"
            as="template"
          >
            <li
              :class="[
                active
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'
                  : 'text-slate-700 dark:text-slate-300',
                'relative cursor-pointer select-none rounded-lg py-2.5 pl-3.5 pr-10 text-sm transition-colors duration-150',
              ]"
            >
              <span class="block truncate" :class="selected ? 'font-medium' : 'font-normal'">
                {{ displayKey ? item[displayKey] : item.subject }}
              </span>

              <span
                v-if="selected"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-600 dark:text-indigo-400"
              >
                <Check class="size-4" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>
