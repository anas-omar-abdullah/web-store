import { ref } from 'vue'

const isAdVisible = ref(true)

export function useAdvertisement() {
  const hideAd = () => {
    isAdVisible.value = false
  }

  const showAd = () => {
    isAdVisible.value = true
  }

  return {
    isAdVisible,
    hideAd,
    showAd
  }
} 