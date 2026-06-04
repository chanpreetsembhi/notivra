import { ref, computed } from 'vue'

const isAdmin = ref(false)

export const useAuth = () => {
  // ✅ Check localStorage on page load
  const checkAdmin = () => {
    const adminUser = localStorage.getItem('adminUser')
    isAdmin.value = adminUser !== null
  }

  const loginAdmin = () => {
    isAdmin.value = true
  }

  const logoutAdmin = () => {
    isAdmin.value = false
    // ✅ Only remove adminUser, no token
    localStorage.removeItem('adminUser')
  }

  return {
    isAdmin: computed(() => isAdmin.value),
    loginAdmin,
    logoutAdmin,
    checkAdmin,
  }
}
