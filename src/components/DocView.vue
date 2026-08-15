<script setup lang="ts">
import { marked } from 'marked'
import { onMounted, ref } from 'vue'
import { LoaderCircle, CircleAlert } from 'lucide-vue-next'

const props = defineProps<{
  file: string
}>()

const markdown = ref<string>('')
const isLoading = ref(true)
const hasError = ref(false)

function toRawGitHubUrl(url: string): string {
  return url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/')
}

onMounted(async () => {
  try {
    isLoading.value = true
    hasError.value = false

    const rawUrl = toRawGitHubUrl(props.file)
    const response = await fetch(rawUrl)

    if (!response.ok) throw new Error('Network response was not ok')

    const text = await response.text()

    if (text.includes('<html') && text.includes('</html>')) {
      throw new Error('Received HTML instead of Markdown')
    }

    markdown.value = marked.parse(text) as string
  } catch (error) {
    console.error('Failed to load markdown file:', error)
    markdown.value = ''
    hasError.value = true
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <!-- Loading state -->
  <div
    v-if="isLoading"
    class="flex items-center justify-center gap-2 py-12 text-sm text-slate-400 dark:text-slate-500"
  >
    <LoaderCircle class="size-5 animate-spin text-indigo-500 dark:text-indigo-400" />
    <span>Loading content...</span>
  </div>

  <!-- Error state -->
  <div v-else-if="hasError" class="flex flex-col items-center justify-center py-12 text-center">
    <div
      class="mb-3 flex size-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-500/10"
    >
      <CircleAlert class="size-5 text-red-600 dark:text-red-400" />
    </div>
    <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Failed to load content</p>
    <p class="mt-1 text-xs text-slate-400 dark:text-slate-500">
      Please check the URL and try again.
    </p>
  </div>

  <!-- Content -->
  <div
    v-else
    class="markdown-content prose prose-slate dark:prose-invert max-w-none pb-8 prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-7 prose-a:text-indigo-600 dark:prose-a:text-indigo-400 hover:prose-a:underline prose-strong:text-slate-900 dark:prose-strong:text-slate-100 prose-img:rounded-xl prose-hr:border-slate-200 dark:prose-hr:border-slate-700 prose-li:text-slate-700 dark:prose-li:text-slate-300 prose-blockquote:text-slate-600 dark:prose-blockquote:text-slate-300"
    v-html="markdown"
  ></div>
</template>
