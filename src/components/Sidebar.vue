<script setup lang="ts">
import type { Subject } from '@/types/subject'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import axios from 'axios'
import { ExternalLink, Globe, SquarePen, Trash2 } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import Model from './Model.vue'
import InputField from './InputField.vue'
import Button from './Button.vue'
import { toast } from 'vue3-toastify'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { VueSpinnerTail } from 'vue3-spinners'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const router = useRouter()
const { isAdmin } = useAuth()
const subjects = ref<Subject[]>([])
const isLoading = ref(false)

// fetch subjects
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

// Model Handler
const isOpen = ref(false)
const isEditMode = ref(false)
const editingSubjectId = ref<string | null>(null)

const openModel = () => (isOpen.value = true)
const closeModel = () => {
  isOpen.value = false
  // Reset edit mode states
  isEditMode.value = false
  editingSubjectId.value = null
  subjectName.value = ''
  error.value = ''
}

const subjectName = ref('')
const error = ref('')

// Add subject
const submitSubject = async () => {
  if (!subjectName.value.trim()) {
    error.value = 'Subject Name is required'
    return
  }

  try {
    if (isEditMode.value && editingSubjectId.value) {
      // Update existing subject
      await axios.put(`https://nep-backend.vercel.app/api/subjects/${editingSubjectId.value}`, {
        subject: subjectName.value,
      })
      toast.success('Subject Updated Successfully', { autoClose: 1000 })
    } else {
      // Add new subject
      await axios.post('https://nep-backend.vercel.app/api/subjects', {
        subject: subjectName.value,
      })
      toast.success('Subject Added Successfully', { autoClose: 1000 })
    }

    // reset form
    subjectName.value = ''
    isEditMode.value = false
    editingSubjectId.value = null
    closeModel()

    // Reload page after 1 sec
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  } catch (error) {
    console.error('Error:', error)
    toast.error(isEditMode.value ? 'Error updating subject' : 'Error adding subject')
  }
}

// Edit subject
const editSubject = (id: string) => {
  const subject = subjects.value.find((s) => s._id === id)
  if (subject) {
    isEditMode.value = true
    editingSubjectId.value = id
    subjectName.value = subject.subject
    isOpen.value = true
  }
}

// Delete model handler
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

// Delete subject
const deleteSubject = async () => {
  if (!deletingSubjectId.value) return
  try {
    await axios.delete(`https://nep-backend.vercel.app/api/subjects/${deletingSubjectId.value}`)

    subjects.value = subjects.value.filter((subject) => subject._id !== deletingSubjectId.value)
    toast.success('Subject delete successfully', { autoClose: 1000 })
    closeDeleteModel()
    setTimeout(() => {
      router.push('/dashboard')
    })
  } catch (error) {
    console.error('Delete failed:', error)
    toast.error('Failed to delete the subject')
  }
}
</script>
<template>
  <!-- Mobile menu -->
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
        <div class="fixed inset-0 top-20 bg-black/25" />
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
            class="relative flex w-full sm:max-w-xs flex-col overflow-y-auto bg-white shadow-xl mt-20"
          >
            <main class="flex flex-col justify-between h-full">
              <!-- Links -->
              <nav class="flex flex-col justify-between h-full p-5">
                <!-- loading -->
                <div v-if="isLoading" class="flex items-center justify-center h-full">
                  <VueSpinnerTail size="40" color="#00a6f4" />
                </div>
                <div v-else-if="subjects" class="flex flex-col space-y-1.5 w-full overflow-auto">
                  <div v-if="subjects" v-for="subject in subjects" :key="subject._id">
                    <RouterLink
                      :to="`/dashboard/subjects/${subject._id}`"
                      @click="emit('close')"
                      class="text-sm px-3 py-2 rounded-lg hover:bg-neutral-100 block"
                      active-class="bg-sky-100 text-sky-600 hover:bg-sky-100"
                    >
                      {{ subject.subject }}
                    </RouterLink>
                  </div>
                  <p v-if="subjects.length <= 0" class="text-sm px-3 py-2">No subjects available</p>
                </div>
                <p v-else class="text-red-500">Document not found.</p>
                <button
                  v-if="isAdmin"
                  @click="openModel"
                  class="bg-sky-600 hover:bg-sky-500 text-white text-sm px-3 py-2 rounded-lg transition-all ease-in-out duration-300 cursor-pointer"
                >
                  Add Subject
                </button>
              </nav>
              <a
                href="https://chanpreetportfolio.vercel.app"
                target="_blank"
                class="flex items-center gap-2 hover:bg-neutral-100 text-neutral-600 border-t border-neutral-200 p-5"
              >
                <Globe class="size-4" />
                <p class="text-sm">Visit Website</p>
                <ExternalLink class="size-4 ml-auto" />
              </a>
            </main>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
  <aside
    class="bg-white w-1/5 border-r border-gray-200 dark:border-gray-700 hidden lg:flex flex-col justify-between"
  >
    <nav class="flex flex-col justify-between h-full p-5">
      <!-- loading -->
      <div v-if="isLoading" class="flex items-center justify-center h-full">
        <VueSpinnerTail size="40" color="#00a6f4" />
      </div>
      <div v-else-if="subjects" class="flex flex-col space-y-1.5 w-full overflow-auto">
        <div v-if="subjects" v-for="subject in subjects" :key="subject._id">
          <RouterLink
            :to="`/dashboard/subjects/${subject._id}`"
            class="text-sm px-3 py-2 rounded-lg hover:bg-neutral-100 flex items-center justify-between"
            active-class="bg-sky-100 text-sky-600 hover:bg-sky-100"
          >
            {{ subject.subject }}
            <div v-if="isAdmin" class="flex items-center gap-1.5">
              <button
                @click="editSubject(subject._id)"
                type="button"
                class="bg-neutral-100 hover:bg-indigo-500 hover:text-white transition-all ease-in-out duration-150 rounded-md p-1 size-6 cursor-pointer"
              >
                <SquarePen class="size-full" />
              </button>
              <button
                @click="(e) => openDeleteModel(subject._id, e)"
                type="button"
                class="bg-neutral-100 hover:bg-red-500 hover:text-white transition-all ease-in-out duration-150 rounded-md p-1 size-6 cursor-pointer"
              >
                <Trash2 class="size-full" />
              </button>
            </div>
          </RouterLink>
        </div>
        <p v-if="subjects.length <= 0" class="text-sm px-3 py-2">No subjects available</p>
      </div>
      <p v-else class="text-red-500">Document not found.</p>
      <button
        v-if="isAdmin"
        @click="openModel"
        class="bg-sky-600 hover:bg-sky-500 text-white text-sm px-3 py-2 rounded-lg transition-all ease-in-out duration-300 cursor-pointer"
      >
        Add Subject
      </button>
    </nav>
    <a
      href="#"
      target="_blank"
      class="hidden items-center gap-2 hover:bg-neutral-100 text-neutral-600 border-t border-neutral-200 p-5"
    >
      <Globe class="size-4" />
      <p class="text-sm">Visit Website</p>
      <ExternalLink class="size-4 ml-auto" />
    </a>
  </aside>

  <!-- Add/Edit Subject Model -->
  <Model :isOpen="isOpen" @close="closeModel" :title="isEditMode ? 'Edit Subject' : 'Add Subject'">
    <div class="flex flex-col space-y-3">
      <InputField
        v-model="subjectName"
        id="subject"
        label="Subject"
        type="text"
        placeholder="Enter Subject Name"
      />
      <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
      <div class="flex gap-3 mt-4">
        <Button
          varient="primary"
          :label="isEditMode ? 'Update' : 'Add'"
          class="w-full"
          :disabled="subjectName.length <= 0"
          @click="submitSubject"
        />
        <Button varient="danger" label="Cancel" class="w-full" @click="closeModel" />
      </div>
    </div>
  </Model>

  <!-- Delete model -->
  <Model :isOpen="isDeleteOpen" @close="closeDeleteModel">
    <div class="flex items-start gap-3">
      <div class="size-10 bg-red-100 flex items-center justify-center rounded-full shrink-0">
        <Trash2 class="text-red-600 size-5" />
      </div>
      <div>
        <h3 class="text-lg font-semibold text-gray-900 pb-1">Delete document</h3>
        <p class="text-sm text-gray-500">
          Are you sure you want to delete this document? All of your data will be permanently
          removed. This action cannot be undone.
        </p>
      </div>
    </div>
    <div class="flex gap-3 mt-6">
      <Button varient="primary" label="Confirm" class="w-full" @click="deleteSubject" />
      <Button varient="danger" label="Cancel" class="w-full" @click="closeDeleteModel" />
    </div>
  </Model>
</template>
