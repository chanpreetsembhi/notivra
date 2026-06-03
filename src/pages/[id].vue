<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SquarePen, Trash2, FileX } from 'lucide-vue-next'
import axios from 'axios'
import { VueSpinnerTail } from 'vue3-spinners'
import type { Topic } from '@/types/subject'
import DocView from '@/components/DocView.vue'
import Model from '@/components/Model.vue'
import InputField from '@/components/InputField.vue'
import Button from '@/components/Button.vue'
import { toast } from 'vue3-toastify'
import { useAuth } from '@/composables/useAuth'
import { slugify } from '@/utils/slug'

const { isAdmin } = useAuth()

const route = useRoute()
const router = useRouter()
const topicName = ref<Topic | null>(null)
const subjectId = ref<string>('')
const topicId = ref<string>('')

const isLoading = ref(false)
const error = ref<string | null>(null)
const isEditOpen = ref(false)
const isDeleteOpen = ref(false)

const closeEditModel = () => (isEditOpen.value = false)
const openEditModel = () => {
  if (topicName.value) {
    title.value = topicName.value.topic
    url.value = topicName.value.url
  }
  error.value = null
  isEditOpen.value = true
}

const closeDeleteModel = () => (isDeleteOpen.value = false)
const openDeleteModel = () => (isDeleteOpen.value = true)

const title = ref('')
const url = ref('')

onMounted(async () => {
  isLoading.value = true
  try {
    subjectId.value = (route.query.sid as string) || ''
    topicId.value = (route.query.tid as string) || ''

    if (!subjectId.value || !topicId.value) return

    const response = await axios.get(
      `https://nep-backend.vercel.app/api/subjects/${subjectId.value}/topic/${topicId.value}`,
    )

    topicName.value = response.data.topic || null
  } catch {
    topicName.value = null
  } finally {
    isLoading.value = false
  }
})

const editDoc = async () => {
  error.value = null

  if (!title.value.trim() && !url.value.trim()) {
    error.value = 'Title and URL are required'
    return
  } else if (!title.value.trim()) {
    error.value = 'Title is required'
    return
  } else if (!url.value.trim()) {
    error.value = 'URL is required'
    return
  }

  try {
    await axios.put(
      `https://nep-backend.vercel.app/api/subjects/${subjectId.value}/topic/${topicId.value}`,
      { topic: title.value, url: url.value },
    )

    closeEditModel()
    toast.success('Updated successfully', { autoClose: 1000 })

    setTimeout(async () => {
      try {
        const response = await axios.get(
          `https://nep-backend.vercel.app/api/subjects/${subjectId.value}/topic/${topicId.value}`,
        )
        topicName.value = response.data.topic || null
      } catch {
        window.location.reload()
      }
    }, 1000)
  } catch {
    toast.error('Failed to update the document')
  }
}

const deleteDoc = async () => {
  try {
    await axios.delete(
      `https://nep-backend.vercel.app/api/subjects/${subjectId.value}/topic/${topicId.value}`,
    )
    toast.success('Document deleted successfully', { autoClose: 1000 })
    setTimeout(() => {
      router.push({
        name: 'subject-topics',
        params: { subjectSlug: route.params.subjectSlug },
        query: { id: subjectId.value },
      })
    }, 1000)
  } catch {
    toast.error('Failed to delete the document')
  }
}
</script>

<template>
  <div class="h-full bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
    <!-- Loading -->
    <div v-if="isLoading" class="flex h-full items-center justify-center">
      <VueSpinnerTail size="40" color="#6366f1" />
    </div>

    <!-- Content -->
    <div v-else-if="topicName" class="flex h-full flex-col px-5 py-6">
      <!-- Header -->
      <div class="mb-4 flex shrink-0 items-center justify-between">
        <h1
          class="text-xl font-semibold tracking-tight text-slate-800 sm:text-2xl dark:text-slate-100"
        >
          {{ topicName.topic }}
        </h1>

        <div v-if="isAdmin" class="flex items-center gap-2">
          <button
            @click="openEditModel"
            type="button"
            class="flex size-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-500 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
            aria-label="Edit document"
          >
            <SquarePen class="size-4" />
          </button>
          <button
            @click="openDeleteModel"
            type="button"
            class="flex size-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-red-50 hover:text-red-600 dark:text-slate-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
            aria-label="Delete document"
          >
            <Trash2 class="size-4" />
          </button>
        </div>
      </div>

      <!-- Doc viewer -->
      <div class="min-h-0 flex-1">
        <DocView :file="topicName.url" />
      </div>
    </div>

    <!-- Not found -->
    <div v-else class="flex h-full flex-col items-center justify-center px-6 text-center">
      <div
        class="mb-4 flex size-14 items-center justify-center rounded-xl bg-red-50 dark:bg-red-500/10"
      >
        <FileX class="size-6 text-red-600 dark:text-red-400" />
      </div>
      <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Document not found</p>
      <p class="mt-1 max-w-xs text-xs text-slate-400 dark:text-slate-500">
        The document you're looking for doesn't exist or may have been removed.
      </p>
      <button
        @click="router.push({ name: 'dashboard-home' })"
        class="mt-5 inline-flex items-center rounded-lg px-4 py-2 text-sm text-slate-500 transition-colors duration-200 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      >
        Go back
      </button>
    </div>

    <!-- Edit modal -->
    <Model :isOpen="isEditOpen" @close="closeEditModel" title="Edit Document">
      <div class="flex flex-col space-y-3">
        <InputField
          v-model="title"
          id="title"
          label="Title"
          type="text"
          placeholder="Edit document title"
        />
        <InputField
          v-model="url"
          id="url"
          label="URL"
          type="text"
          placeholder="Edit document URL"
        />
        <p
          v-if="error"
          class="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-500/10 dark:text-red-400"
        >
          {{ error }}
        </p>
      </div>
      <div class="mt-6 flex gap-3">
        <Button varient="primary" label="Save Changes" class="w-full" @click="editDoc" />
        <Button varient="secondary" label="Cancel" class="w-full" @click="closeEditModel" />
      </div>
    </Model>

    <!-- Delete modal -->
    <Model :isOpen="isDeleteOpen" @close="closeDeleteModel">
      <div class="flex items-start gap-3">
        <div
          class="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10"
        >
          <Trash2 class="size-5 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h3 class="pb-1 text-lg font-semibold text-slate-800 dark:text-slate-100">
            Delete document
          </h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Are you sure you want to delete this document? All of your data will be permanently
            removed. This action cannot be undone.
          </p>
        </div>
      </div>
      <div class="mt-6 flex gap-3">
        <Button varient="danger" label="Delete" class="w-full" @click="deleteDoc" />
        <Button varient="secondary" label="Cancel" class="w-full" @click="closeDeleteModel" />
      </div>
    </Model>
  </div>
</template>
