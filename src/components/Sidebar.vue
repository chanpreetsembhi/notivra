<script setup lang="ts">
import type { Subject } from '@/types/subject'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import axios from 'axios'
import { SquarePen, Trash2, BookOpen, Plus } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import Model from './Model.vue'
import InputField from './InputField.vue'
import Button from './Button.vue'
import { toast } from 'vue3-toastify'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { VueSpinnerTail } from 'vue3-spinners'
import { slugify } from '@/utils/slug'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const router = useRouter()
const { isAdmin } = useAuth()
const subjects = ref<Subject[]>([])
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  try {
    const { data } = await axios.get('https://nep-backend.vercel.app/api/subjects')
    subjects.value = data.subjects
  } catch (error) {
    console.error('Failed to fetch:', error)
  } finally {
    isLoading.value = false
  }
})

const isOpen = ref(false)
const isEditMode = ref(false)
const editingSubjectId = ref<string | null>(null)
const subjectName = ref('')
const error = ref('')

const openModel = () => (isOpen.value = true)
const closeModel = () => {
  isOpen.value = false
  isEditMode.value = false
  editingSubjectId.value = null
  subjectName.value = ''
  error.value = ''
}

const submitSubject = async () => {
  if (!subjectName.value.trim()) {
    error.value = 'Subject name is required'
    return
  }
  try {
    if (isEditMode.value && editingSubjectId.value) {
      await axios.put(`https://nep-backend.vercel.app/api/subjects/${editingSubjectId.value}`, {
        subject: subjectName.value,
      })
      toast.success('Subject updated', { autoClose: 1000 })
    } else {
      await axios.post('https://nep-backend.vercel.app/api/subjects', {
        subject: subjectName.value,
      })
      toast.success('Subject added', { autoClose: 1000 })
    }
    subjectName.value = ''
    isEditMode.value = false
    editingSubjectId.value = null
    closeModel()
    setTimeout(() => window.location.reload(), 1000)
  } catch {
    toast.error(isEditMode.value ? 'Error updating subject' : 'Error adding subject')
  }
}

const editSubject = (id: string) => {
  const subject = subjects.value.find((s) => s._id === id)
  if (subject) {
    isEditMode.value = true
    editingSubjectId.value = id
    subjectName.value = subject.subject
    isOpen.value = true
  }
}

const isDeleteOpen = ref(false)
const deletingSubjectId = ref<string | null>(null)

const closeDeleteModel = () => {
  isDeleteOpen.value = false
  deletingSubjectId.value = null
}
const openDeleteModel = (id: string, event: Event) => {
  event.preventDefault()
  deletingSubjectId.value = id
  isDeleteOpen.value = true
}

const deleteSubject = async () => {
  if (!deletingSubjectId.value) return
  try {
    await axios.delete(`https://nep-backend.vercel.app/api/subjects/${deletingSubjectId.value}`)
    subjects.value = subjects.value.filter((s) => s._id !== deletingSubjectId.value)
    toast.success('Subject deleted', { autoClose: 1000 })
    closeDeleteModel()
    setTimeout(() => router.push({ name: 'dashboard-home' }))
  } catch {
    toast.error('Failed to delete subject')
  }
}
</script>

<template>
  <!-- Mobile Drawer -->
  <TransitionRoot as="template" :show="open">
    <Dialog class="relative z-30 lg:hidden" @close="emit('close')">
      <TransitionChild
        as="template"
        enter="transition-opacity ease-linear duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition-opacity ease-linear duration-300"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 top-14 bg-slate-900/30 backdrop-blur-sm dark:bg-black/50" />
      </TransitionChild>
      <div class="fixed inset-0 z-40 flex">
        <TransitionChild
          as="template"
          enter="transition ease-in-out duration-300 transform"
          enter-from="-translate-x-full"
          enter-to="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leave-from="translate-x-0"
          leave-to="-translate-x-full"
        >
          <DialogPanel
            class="relative mt-14 flex w-80 flex-col border-r border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
          >
            <button @click="emit('close')" class="sr-only" aria-label="Close sidebar">Close</button>

            <!-- Header -->
            <div
              class="flex items-center gap-2.5 border-b border-slate-200 px-5 py-4 dark:border-slate-800"
            >
              <div
                class="flex size-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/10"
              >
                <BookOpen class="size-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Subjects
              </span>
              <span
                class="ml-auto rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium tabular-nums text-slate-400 dark:bg-slate-800 dark:text-slate-500"
              >
                {{ subjects.length }}
              </span>
            </div>

            <!-- Nav -->
            <nav class="flex-1 overflow-y-auto p-2.5">
              <div v-if="isLoading" class="flex h-32 items-center justify-center">
                <VueSpinnerTail size="28" color="#6366f1" />
              </div>
              <template v-else-if="subjects.length > 0">
                <RouterLink
                  v-for="subject in subjects"
                  :key="subject._id"
                  :to="{
                    name: 'subject-topics',
                    params: { subjectSlug: slugify(subject.subject) },
                    query: { id: subject._id },
                  }"
                  @click="emit('close')"
                  class="group relative mb-0.5 flex items-center rounded-lg px-3.5 py-2.5 text-sm text-slate-600 transition-all duration-150 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
                  active-class="!bg-indigo-50 !text-indigo-700 font-medium dark:!bg-indigo-500/10 dark:!text-indigo-400"
                >
                  <span :class="['truncate', isAdmin ? 'pr-14' : '']">
                    {{ subject.subject }}
                  </span>

                  <div
                    v-if="isAdmin"
                    class="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1"
                  >
                    <button
                      @click.prevent="editSubject(subject._id)"
                      type="button"
                      class="flex size-6 cursor-pointer items-center justify-center rounded-md text-slate-400 transition-colors duration-150 hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-500 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                      title="Edit"
                    >
                      <SquarePen class="size-4" />
                    </button>
                    <button
                      @click.prevent="(e) => openDeleteModel(subject._id, e)"
                      type="button"
                      class="flex size-6 cursor-pointer items-center justify-center rounded-md text-slate-400 transition-colors duration-150 hover:bg-red-50 hover:text-red-600 dark:text-slate-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 class="size-4" />
                    </button>
                  </div>
                </RouterLink>
              </template>
              <p v-else class="px-3.5 py-4 text-sm text-slate-400 dark:text-slate-500">
                No subjects yet.
              </p>
            </nav>

            <!-- Footer -->
            <div class="border-t border-slate-200 p-3 dark:border-slate-800">
              <button
                v-if="isAdmin"
                @click="openModel"
                class="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                <Plus class="size-4" />
                Add Subject
              </button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- Desktop Sidebar -->
  <aside
    class="hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex xl:w-72 dark:border-slate-800 dark:bg-slate-950"
  >
    <!-- Header -->
    <div
      class="flex items-center gap-2.5 border-b border-slate-200 px-5 py-4 dark:border-slate-800"
    >
      <div
        class="flex size-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/10"
      >
        <BookOpen class="size-4 text-indigo-600 dark:text-indigo-400" />
      </div>
      <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Subjects</span>
      <span
        class="ml-auto rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium tabular-nums text-slate-400 dark:bg-slate-800 dark:text-slate-500"
      >
        {{ subjects.length }}
      </span>
    </div>

    <!-- Nav -->
    <nav class="flex-1 overflow-y-auto p-2.5">
      <div v-if="isLoading" class="flex h-32 items-center justify-center">
        <VueSpinnerTail size="28" color="#6366f1" />
      </div>
      <template v-else-if="subjects.length > 0">
        <RouterLink
          v-for="subject in subjects"
          :key="subject._id"
          :to="{
            name: 'subject-topics',
            params: { subjectSlug: slugify(subject.subject) },
            query: { id: subject._id },
          }"
          class="group relative mb-0.5 flex items-center rounded-lg px-3.5 py-2.5 text-sm text-slate-600 transition-all duration-150 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
          active-class="!bg-indigo-50 !text-indigo-700 font-medium dark:!bg-indigo-500/10 dark:!text-indigo-400"
        >
          <span :class="['truncate', isAdmin ? 'pr-14' : '']">
            {{ subject.subject }}
          </span>

          <div
            v-if="isAdmin"
            class="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          >
            <button
              @click.prevent="editSubject(subject._id)"
              type="button"
              class="flex size-6 cursor-pointer items-center justify-center rounded-md text-slate-400 transition-colors duration-150 hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-500 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
              title="Edit"
            >
              <SquarePen class="size-4" />
            </button>
            <button
              @click.prevent="(e) => openDeleteModel(subject._id, e)"
              type="button"
              class="flex size-6 cursor-pointer items-center justify-center rounded-md text-slate-400 transition-colors duration-150 hover:bg-red-50 hover:text-red-600 dark:text-slate-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
              title="Delete"
            >
              <Trash2 class="size-4" />
            </button>
          </div>
        </RouterLink>
      </template>
      <p v-else class="px-3.5 py-4 text-sm text-slate-400 dark:text-slate-500">No subjects yet.</p>
    </nav>

    <!-- Footer -->
    <div class="border-t border-slate-200 p-3 dark:border-slate-800">
      <button
        v-if="isAdmin"
        @click="openModel"
        class="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
      >
        <Plus class="size-4" />
        Add Subject
      </button>
    </div>
  </aside>

  <!-- Add / Edit Modal -->
  <Model :isOpen="isOpen" @close="closeModel" :title="isEditMode ? 'Edit Subject' : 'Add Subject'">
    <div class="flex flex-col gap-4">
      <InputField
        v-model="subjectName"
        id="subject"
        label="Subject Name"
        type="text"
        placeholder="e.g. English Literature"
      />
      <p
        v-if="error"
        class="-mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-500/10 dark:text-red-400"
      >
        {{ error }}
      </p>
      <div class="flex gap-2.5 pt-1">
        <Button
          varient="primary"
          :label="isEditMode ? 'Update' : 'Add Subject'"
          class="w-full"
          :disabled="!subjectName.trim()"
          @click="submitSubject"
        />
        <Button varient="secondary" label="Cancel" class="w-full" @click="closeModel" />
      </div>
    </div>
  </Model>

  <!-- Delete Modal -->
  <Model :isOpen="isDeleteOpen" @close="closeDeleteModel">
    <div class="flex items-start gap-4">
      <div
        class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-50 dark:bg-red-500/10"
      >
        <Trash2 class="size-4 text-red-600 dark:text-red-400" />
      </div>
      <div>
        <h3 class="mb-1 font-semibold text-slate-800 dark:text-slate-100">Delete subject?</h3>
        <p class="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          This will permanently remove the subject and all its content. This action cannot be
          undone.
        </p>
      </div>
    </div>
    <div class="mt-6 flex gap-2.5">
      <Button varient="danger" label="Delete" class="w-full" @click="deleteSubject" />
      <Button varient="secondary" label="Cancel" class="w-full" @click="closeDeleteModel" />
    </div>
  </Model>
</template>
