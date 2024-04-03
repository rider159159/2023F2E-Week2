<script setup>
import { defineEmits, defineProps, reactive, ref } from 'vue'
import { createPopper } from '@popperjs/core'

const props = defineProps({
  title: { type: String, default: '請選擇' },
  items: Array,
})

// const emits = defineEmits(['update:modelValue'])
const model = defineModel()

const button = ref(null)
const menu = ref(null)

const state = reactive({
  menuVisible: false, // 是否顯示按鈕
  buttonText: props.title, // 按鈕文字
})

let popperInstance = null

// 開關選單
function toggleMenu() {
  state.menuVisible = !state.menuVisible
  if (state.menuVisible)
    createPopperInstance()
  else destroyPopperInstance()
}

function createPopperInstance() {
  popperInstance = createPopper(button.value, menu.value, {
    // top-start、 top 、 top-end、 bottom...
    placement: 'top-start',
    modifiers: [
      { name: 'flip', options: { fallbackPlacements: ['bottom'] } },
      { name: 'offset', options: { offset: [0, 8] } },
    ],
  })
}

// 移除下拉選單
function destroyPopperInstance() {
  if (popperInstance) {
    popperInstance.destroy()
    popperInstance = null
  }
}

// 點擊下拉選單外部，關閉選單以及相關事件
function handleClickOutside(event) {
  if (
    button.value
    && menu.value
    && !button.value.contains(event.target)
    && !menu.value.contains(event.target)
  ) {
    state.menuVisible = false
    destroyPopperInstance()
  }
}

// 選擇指定選單，關閉選單並 emit 資料
function selectOption(option) {
  state.buttonText = option.label // 更新按鈕
  state.menuVisible = false // 關閉選單
  destroyPopperInstance()
  model.value = option.value
}

// 點擊 close 圖示，清除資料並關閉選單
function closeButtonText() {
  state.buttonText = props.title // 更新按鈕
  state.menuVisible = false // 關閉選單
  destroyPopperInstance()
  emits('update:modelValue', '')
}

watch(() => {

})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  destroyPopperInstance()
})
</script>

<template>
  <div class="dropdown inline-block bg-#E9ECEF py-2 px-4 rounded-50px mr-4">
    <div class="dropdownBTN flex justify-center pr-2">
      <button
        ref="button"
        class="pl-2 bg-transparent flex items-center"
        @click="toggleMenu"
      >
        <p class="mr-4 break-keep">
          {{ state.buttonText }}
        </p>
        <img
          v-if="state.buttonText === props.title"
          src="/dropdown.svg"
          class="w-5 cursor-pointer"
          alt=""
        >
      </button>
    </div>

    <div
      v-show="state.menuVisible"
      ref="menu"
      class="dropdownMenu shadow-lg bg-white border-1 border-#ddd p-10px flex flex-col gap-2"
    >
      <!-- 下拉選單內容 -->
      <a
        v-for="item in props.items"
        :key="item.value"
        href="#"
        @click.prevent="selectOption(item)"
      >{{ item.label }}</a>
    </div>
  </div>
</template>
