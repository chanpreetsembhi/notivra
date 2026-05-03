<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { FilePlus2, Menu, X } from 'lucide-vue-next'
import Model from './Model.vue'
import InputField from './InputField.vue'
import Button from './Button.vue'
import Dropdown from './Dropdown.vue'
import axios from 'axios'
import { toast } from 'vue3-toastify'
import type { Subject } from '@/types/subject'
import { useAuth } from '@/composables/useAuth'

defineProps<{ sidebarOpen: boolean }>()

const emit = defineEmits<{
  (e: 'toggle-sidebar'): void
}>()

const router = useRouter()
const { isAdmin, checkAdmin, logoutAdmin } = useAuth()

const isOpen = ref(false)

const openModel = () => (isOpen.value = true)
const closeModel = () => {
  isOpen.value = false
  title.value = ''
  url.value = ''
  selectedSubject.value = { subject: 'None' }
  error.value = null
}

const subjects = ref<Subject[]>([])
const title = ref('')
const url = ref('')
const selectedSubject = ref({ subject: 'None' })

const error = ref<string | null>(null)

const submitTopic = async () => {
  if (!title.value.trim() && !url.value.trim()) {
    error.value = 'Title and Url are required'
    return
  } else if (!title.value.trim()) {
    error.value = 'Title is required'
    return
  } else if (!url.value.trim()) {
    error.value = 'Url is required'
    return
  }

  if (selectedSubject.value.subject === 'None') {
    error.value = 'Please select a subject'
    return
  }

  try {
    const subjectId = subjects.value.find((s) => s.subject === selectedSubject.value.subject)?._id

    if (!subjectId) {
      error.value = 'Invalid subject Id'
      return
    }
    // Make post request
    await axios.post(`https://nep-backend.vercel.app/api/subjects/${subjectId}/topics`, {
      topic: title.value,
      url: url.value,
      category: selectedSubject.value.subject,
    })

    // Reset form
    title.value = ''
    url.value = ''
    selectedSubject.value = { subject: 'None' }
    closeModel()
    toast.success('Document added', { autoClose: 1000 })

    // Reload page after 1 second
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  } catch (error: any) {
    console.error('Error response:', error?.response?.data || error.message)
    toast.error(error?.response?.data?.message || 'Error adding doc')
  }
}

// fetch subjects
const fetchSubjects = async () => {
  try {
    const { data } = await axios.get('https://nep-backend.vercel.app/api/subjects')
    subjects.value = data.subjects
  } catch (error) {
    console.error('Failed to fetch:', error)
  }
}

// login
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
      const userIsAdmin = data.user?.role === 'admin' || data.user?.isAdmin === true

      // Store admin info in localStorage
      localStorage.setItem('isAdmin', 'true')
      localStorage.setItem('adminUser', JSON.stringify(data.user))

      // Update auth state
      checkAdmin()

      // Close modal and show success
      closeLoginModel()

      if (userIsAdmin) {
        toast.success('Login successful!', { autoClose: 1000 })
      } else {
        toast.success('Login successful! (Limited access)', { autoClose: 1000 })
      }

      // Reload to show admin features
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  } catch (error) {
    console.error('Login error:', error)
    toast.error(loginError.value)
  } finally {
    isLoggingIn.value = false
  }
}

const handleLogout = () => {
  logoutAdmin()
  toast.success('Logged out successfully', { autoClose: 1000 })
  setTimeout(() => {
    window.location.reload()
  }, 1000)
}

onMounted(() => {
  checkAdmin()
  fetchSubjects()
})
</script>

<template>
  <header class="bg-white border-b border-neutral-200 py-5 px-5 sm:px-5 md:px-8 sticky top-0 z-40">
    <div class="flex items-center justify-between">
      <!-- menu button -->
      <div class="flex items-center gap-3 lg:hidden order-2 lg:order-0 sm:mr-3">
        <button
          v-if="isAdmin"
          type="button"
          @click="openModel"
          class="bg-neutral-50 rounded-md flex items-center justify-center p-2 hover:bg-sky-600 hover:text-white cursor-pointer transition ease-in-out duration-200 size-10 ring-1 ring-neutral-200 lg:hidden"
        >
          <FilePlus2 class="size-7" />
        </button>

        <!-- Login/logout Button mobile view -->
        <div class="lg:hidden">
          <button
            v-if="!isAdmin"
            type="button"
            @click="openLoginModel"
            class="bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-sm rounded-md px-3 py-2 cursor-pointer"
          >
            Login
          </button>
          <button
            v-else
            type="button"
            @click="handleLogout"
            class="bg-red-500 hover:bg-red-600 text-white font-medium text-sm rounded-md px-3 py-2 cursor-pointer"
          >
            Logout
          </button>
        </div>
        <button
          type="button"
          @click="emit('toggle-sidebar')"
          class="bg-neutral-50 hover:bg-neutral-100 dark:hover:bg-gray-700 rounded-md transition-all duration-200 p-1 cursor-pointer size-9 ring-1 ring-neutral-200"
        >
          <component :is="sidebarOpen ? X : Menu" class="size-7" />
        </button>
      </div>
      <RouterLink to="/" class="flex items-center gap-2 header-logo">
        <div
          class="bg-black text-white size-9 text-2xl font-extrabold rounded-md grid place-content-center"
        >
          N
        </div>
        <div class="font-extrabold text-2xl">NEP</div>
      </RouterLink>
      <div class="lg:flex items-center gap-2 ml-auto hidden">
        <button
          v-if="isAdmin"
          type="button"
          @click="openModel"
          class="bg-neutral-100 rounded-md sm:flex items-center justify-center p-1.5 hover:bg-sky-600 hover:text-white cursor-pointer size-7 transition ease-in-out duration-200 hidden"
        >
          <FilePlus2 />
        </button>
        <div class="bg-neutral-100 text-neutral-600 text-xs rounded-md px-2.5 py-1.5">DOCS</div>
        <div class="bg-neutral-100 text-neutral-600 text-xs rounded-md px-2.5 py-1.5">V1.0</div>
        <!-- Login/logout Button pc view -->
        <div>
          <button
            v-if="!isAdmin"
            type="button"
            @click="openLoginModel"
            class="bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-xs rounded-md px-2.5 py-1.5 cursor-pointer"
          >
            Login
          </button>
          <button
            v-else
            type="button"
            @click="handleLogout"
            class="bg-red-500 hover:bg-red-600 text-white font-medium text-xs rounded-md px-2.5 py-1.5 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Add Topic Model -->
  <Model :isOpen="isOpen" @close="closeModel" title="Add New Topic">
    <div class="flex flex-col space-y-3">
      <InputField
        v-model="title"
        id="title"
        label="Title"
        type="text"
        placeholder="Enter Topic Title"
      />
      <InputField v-model="url" id="url" label="Url" type="text" placeholder="Enter Topic Url" />
      <Dropdown label="Subject" v-model="selectedSubject" :items="subjects" />
      <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
      <div class="flex gap-3 mt-4">
        <Button
          varient="primary"
          label="Add"
          class="w-full"
          :disabled="selectedSubject.subject === 'None'"
          @click="submitTopic"
        />
        <Button varient="danger" label="Cancel" class="w-full" @click="closeModel" />
      </div>
    </div>
  </Model>

  <!-- login Model -->
  <Model :isOpen="loginModel" @close="closeLoginModel" title="Log In">
    <div class="flex flex-col space-y-3">
      <InputField
        v-model="username"
        id="username"
        label="Username"
        type="text"
        placeholder="Enter Username"
      />
      <InputField
        v-model="password"
        id="password"
        label="Password"
        type="password"
        placeholder="Enter password"
      />
      <p v-if="loginError" class="text-xs text-red-500">{{ loginError }}</p>
    </div>
    <div class="flex gap-3 mt-6">
      <Button
        varient="primary"
        :label="isLoggingIn ? 'Logging in...' : 'Login'"
        class="w-full"
        @click="handleLogin"
      />
      <Button varient="danger" label="Cancel" class="w-full" @click="closeLoginModel" />
    </div>
  </Model>
</template>
