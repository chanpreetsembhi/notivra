<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Topic } from '@/types/subject'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { VueSpinnerTail } from 'vue3-spinners'
import { BookOpen } from 'lucide-vue-next'
import Title from '@/components/Title.vue'
import { slugify } from '@/utils/slug'

const route = useRoute()
const topics = ref<Topic[]>([])
const subjectName = ref<string>('')
const subjectId = ref<string>('')
const loading = ref(false)

const fetchTopics = async () => {
  try {
    loading.value = true
    const id = route.query.id as string
    if (!id) return

    subjectId.value = id

    const { data } = await axios.get(`https://nep-backend.vercel.app/api/subjects/${id}/topics`)
    topics.value = data.topics || []
    subjectName.value = data.subject || ''
  } catch (error) {
    console.error('Failed to fetch topics:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchTopics)
watch(
  () => route.query.id,
  () => {
    if (route.query.id) fetchTopics()
  },
)
</script>

<template>
  <div class="h-full overflow-y-auto bg-white dark:bg-slate-900">
    <div class="mx-auto max-w-7xl px-5 py-8">
      <!-- Loading -->
      <div v-if="loading" class="flex h-64 items-center justify-center">
        <VueSpinnerTail size="32" color="#6366f1" />
      </div>

      <template v-else>
        <!-- Header -->
        <Title
          label="Topics"
          :title="subjectName"
          description="Browse all available topics for this subject and open any note to start reading."
          :count="String(topics.length)"
          :count-label="topics.length === 1 ? 'Topic' : 'Topics'"
        />

        <!-- Topics grid -->
        <div
          v-if="topics.length > 0"
          class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <RouterLink
            v-for="topic in topics"
            :key="topic._id"
            :to="{
              name: 'topic-detail',
              params: {
                subjectSlug: slugify(subjectName),
                topicSlug: slugify(topic.topic),
              },
              query: {
                sid: subjectId,
                tid: topic._id,
              },
            }"
            class="group flex flex-col rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all duration-150 hover:border-indigo-300 hover:bg-indigo-50/40 dark:border-slate-800 dark:bg-slate-800 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/5"
          >
            <p
              class="line-clamp-2 text-center text-sm font-medium leading-snug truncate text-slate-700 transition-colors duration-150 group-hover:text-indigo-700 dark:text-slate-300 dark:group-hover:text-indigo-400"
            >
              {{ topic.topic }}
            </p>
          </RouterLink>
        </div>

        <!-- Empty state -->
        <div v-else class="flex flex-col items-center justify-center py-20 text-center">
          <div
            class="mb-4 flex size-12 items-center justify-center rounded-xl bg-indigo-50 ring-1 ring-indigo-100 dark:bg-indigo-500/10 dark:ring-indigo-500/20"
          >
            <BookOpen class="size-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p class="text-sm font-medium text-slate-500 dark:text-slate-400">No topics yet</p>
          <p class="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Topics added to this subject will appear here.
          </p>
        </div>
      </template>
    </div>
  </div>
</template>
