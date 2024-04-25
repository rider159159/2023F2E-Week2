// composables/useScreenWidth.js
import { ref, onMounted, onUnmounted } from 'vue';

export function useScreenWidth() {
    const screenWidth = ref(window.innerWidth);

    const updateWidth = () => {
        screenWidth.value = window.innerWidth;
    };

    onMounted(() => {
        window.addEventListener('resize', updateWidth);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', updateWidth);
    });

    return { screenWidth };
}