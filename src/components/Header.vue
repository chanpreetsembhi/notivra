<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { FilePlus2, Menu, X } from 'lucide-vue-next'
import Model from './Model.vue'
import InputField from './InputField.vue'
import Button from './Button.vue'
import Dropdown from './Dropdown.vue'
import axios from 'axios'
import { toast } from 'vue3-toastify'
import type { Subject } from '@/types/subject'
import { useAuth } from '@/composables/useAuth'
import Logo from '@/assets/logo.svg'

defineProps<{ sidebarOpen: boolean }>()
const emit = defineEmits<{ (e: 'toggle-sidebar'): void }>()

const { isAdmin, checkAdmin, logoutAdmin } = useAuth()

const isOpen = ref(false)
const subjects = ref<Subject[]>([])
const title = ref('')
const url = ref('')
const selectedSubject = ref({ subject: 'None' })
const error = ref<string | null>(null)

const openModel = () => (isOpen.value = true)
const closeModel = () => {
  isOpen.value = false
  title.value = ''
  url.value = ''
  selectedSubject.value = { subject: 'None' }
  error.value = null
}

const submitTopic = async () => {
  if (!title.value.trim()) {
    error.value = 'Title is required'
    return
  }
  if (!url.value.trim()) {
    error.value = 'URL is required'
    return
  }
  if (selectedSubject.value.subject === 'None') {
    error.value = 'Please select a subject'
    return
  }

  try {
    const subjectId = subjects.value.find((s) => s.subject === selectedSubject.value.subject)?._id
    if (!subjectId) {
      error.value = 'Invalid subject'
      return
    }

    await axios.post(`https://nep-backend.vercel.app/api/subjects/${subjectId}/topics`, {
      topic: title.value,
      url: url.value,
      category: selectedSubject.value.subject,
    })

    closeModel()
    toast.success('Document added', { autoClose: 1000 })
    setTimeout(() => window.location.reload(), 1000)
  } catch (err: any) {
    toast.error(err?.response?.data?.message || 'Error adding document')
  }
}

const username = ref('')
const password = ref('')
const loginError = ref<string | null>(null)
const isLoggingIn = ref(false)
const loginModel = ref(false)

const openLoginModel = () => {
  loginModel.value = true
  loginError.value = null
  username.value = ''
  password.value = ''
}
const closeLoginModel = () => {
  loginModel.value = false
  loginError.value = null
  username.value = ''
  password.value = ''
}

const handleLogin = async () => {
  if (!username.value.trim() || !password.value.trim()) {
    loginError.value = 'Username and password are required'
    return
  }
  isLoggingIn.value = true
  loginError.value = null
  try {
    const { data } = await axios.post('https://nep-backend.vercel.app/api/admin/login', {
      username: username.value,
      password: password.value,
    })
    if (data.success) {
      localStorage.setItem('isAdmin', 'true')
      localStorage.setItem('adminUser', JSON.stringify(data.user))
      checkAdmin()
      closeLoginModel()
      toast.success('Login successful!', { autoClose: 1000 })
      setTimeout(() => window.location.reload(), 1000)
    }
  } catch {
    loginError.value = 'Invalid credentials'
    toast.error('Login failed')
  } finally {
    isLoggingIn.value = false
  }
}

const handleLogout = () => {
  logoutAdmin()
  toast.success('Logged out', { autoClose: 1000 })
  setTimeout(() => window.location.reload(), 1000)
}

const fetchSubjects = async () => {
  try {
    const { data } = await axios.get('https://nep-backend.vercel.app/api/subjects')
    subjects.value = data.subjects
  } catch {
    console.error('Failed to fetch subjects')
  }
}

onMounted(() => {
  checkAdmin()
  fetchSubjects()
})
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
  >
    <div class="flex h-14 items-center gap-3 px-4 sm:px-6">
      <!-- Logo -->
      <RouterLink :to="{ name: 'intro' }" class="mr-auto flex shrink-0 items-center gap-2 lg:mr-0">
        <div
          class="flex size-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/10"
        >
          <img :src="Logo" class="size-5" alt="Notivra logo" />
        </div>

        <span class="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-100">
          Notivra
        </span>

        <span
          class="ml-1 hidden rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-400 sm:inline dark:bg-slate-800 dark:text-slate-500"
        >
          v1.0
        </span>
      </RouterLink>

      <!-- Desktop right actions -->
      <div class="ml-auto hidden items-center gap-2 lg:flex">
        <span
          class="inline-flex h-8 items-center rounded-lg bg-slate-100 px-3 text-xs font-medium text-slate-400 dark:bg-slate-800 dark:text-slate-500"
        >
          DOCS
        </span>

        <button
          v-if="isAdmin"
          type="button"
          @click="openModel"
          class="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg bg-slate-100 px-3 text-xs font-medium text-slate-600 transition-colors duration-150 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <FilePlus2 class="size-3.5" />
          Add Doc
        </button>

        <button
          v-if="!isAdmin"
          type="button"
          @click="openLoginModel"
          class="inline-flex h-8 cursor-pointer items-center rounded-lg bg-indigo-600 px-3 text-xs font-medium text-white transition-colors duration-150 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          Login
        </button>
        <button
          v-else
          type="button"
          @click="handleLogout"
          class="inline-flex h-8 cursor-pointer items-center rounded-lg bg-red-50 px-3 text-xs font-medium text-red-600 transition-colors duration-150 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
        >
          Logout
        </button>
      </div>

      <!-- Mobile right actions -->
      <div class="flex items-center gap-2 lg:hidden">
        <button
          v-if="isAdmin"
          type="button"
          @click="openModel"
          class="flex size-8 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          title="Add document"
        >
          <FilePlus2 class="size-4" />
        </button>

        <button
          v-if="!isAdmin"
          type="button"
          @click="openLoginModel"
          class="inline-flex h-8 cursor-pointer items-center rounded-lg bg-indigo-600 px-3 text-xs font-medium text-white transition-colors duration-150 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          Login
        </button>
        <button
          v-else
          type="button"
          @click="handleLogout"
          class="inline-flex h-8 cursor-pointer items-center rounded-lg bg-red-50 px-3 text-xs font-medium text-red-600 transition-colors duration-150 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
        >
          Logout
        </button>

        <button
          type="button"
          @click="emit('toggle-sidebar')"
          class="flex size-8 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <component :is="sidebarOpen ? X : Menu" class="size-4" />
        </button>
      </div>
    </div>
  </header>

  <!-- Add Topic Modal -->
  <Model :isOpen="isOpen" @close="closeModel" title="Add New Document">
    <div class="flex flex-col gap-3.5">
      <InputField v-model="title" id="title" label="Title" type="text" placeholder="Topic title" />
      <InputField v-model="url" id="url" label="URL" type="text" placeholder="https://..." />
      <Dropdown label="Subject" v-model="selectedSubject" :items="subjects" />
      <p
        v-if="error"
        class="-mt-1 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-500/10 dark:text-red-400"
      >
        {{ error }}
      </p>
      <div class="flex gap-2.5 pt-1">
        <Button
          varient="primary"
          label="Add Document"
          class="w-full"
          :disabled="selectedSubject.subject === 'None'"
          @click="submitTopic"
        />
        <Button varient="secondary" label="Cancel" class="w-full" @click="closeModel" />
      </div>
    </div>
  </Model>

  <!-- Login Modal -->
  <Model :isOpen="loginModel" @close="closeLoginModel" title="Admin Login">
    <div class="flex flex-col gap-3.5">
      <InputField
        v-model="username"
        id="username"
        label="Username"
        type="text"
        placeholder="Enter username"
      />
      <InputField
        v-model="password"
        id="password"
        label="Password"
        type="password"
        placeholder="Enter password"
      />
      <p
        v-if="loginError"
        class="-mt-1 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-500/10 dark:text-red-400"
      >
        {{ loginError }}
      </p>
      <div class="flex gap-2.5 pt-1">
        <Button
          varient="primary"
          :label="isLoggingIn ? 'Logging in…' : 'Login'"
          class="w-full"
          @click="handleLogin"
        />
        <Button varient="secondary" label="Cancel" class="w-full" @click="closeLoginModel" />
      </div>
    </div>
  </Model>
</template>
