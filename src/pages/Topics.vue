<script setup lang="ts">
import Title from '@/components/Title.vue'
import { onMounted, ref, watch } from 'vue'
import type { Topic } from '@/types/subject'
import axios from 'axios'
import { useRoute } from 'vue-router'

const route = useRoute()
const topics = ref<Topic[]>([])
const subjectName = ref<string>('')
const loading = ref(false)

const fetchTopics = async () => {
  try {
    loading.value = true
    const subjectId = route.params.subjectId
    const { data } = await axios.get(
      `https://nep-backend.vercel.app/api/subjects/${subjectId}/topics`,
    )
    topics.value = data.topics || []
    subjectName.value = data.subject || ''
  } catch (error) {
    console.error('Failed to topics:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTopics()
})

// Switch between routes
watch(
  () => route.params.subjectId,
  () => {
    if (route.params.subjectId) {
      fetchTopics()
    }
  },
)
</script>

<template>
  <div v-if="loading" class="text-center text-gray-500 mt-10">
    <p>loading topics....</p>
  </div>

  <div v-else>
    <Title>{{ subjectName }}</Title>

    <div
      v-if="topics.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      <RouterLink
        v-for="topic in topics"
        :key="topic._id"
        :to="{ name: 'topic-detail', params: { subjectId: route.params.id, topicId: topic._id } }"
        class="bg-white border border-neutral-200 rounded-xl shadow-xs hover:shadow-md transition-shadow hover:text-sky-600 duration-200 text-center p-4"
      >
        <h3 class="font-medium text-lg truncate">{{ topic.topic }}</h3>
      </RouterLink>
    </div>
    <div v-if="topics.length === 0" class="text-center text-gray-500 mt-10">
      <p>No topics available for this subject.</p>
    </div>
  </div>
</template>
