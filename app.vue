<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const onlineCount = ref(0)
let eventSource: EventSource | null = null

onMounted(() => {
  eventSource = new EventSource('/api/online-users')

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data)
    onlineCount.value = data.count
  }

  eventSource.onerror = () => {
    eventSource?.close()
  }
})

onBeforeUnmount(() => {
  eventSource?.close()
})
</script>

<template>
  <div>Онлайн: {{ onlineCount }}</div>
</template>
