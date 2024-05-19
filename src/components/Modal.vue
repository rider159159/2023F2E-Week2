<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: () => false
  },
  width: {
    type: String,
    default: () => ''
  },
  title: {
    type: String,
    default: () => ''
  },
  titleClass: {
    type: String
  },
  headerClass: {
    type: String
  },
  bodyClass: {
    type: String
  }
})
const emit = defineEmits(['update:modelValue'])

const closeModal = () => {
  console.log('closeModal')
  emit('update:modelValue', false)
}

</script>
<template>
  <section v-show="props.modelValue">
    <div class="fixed top-0 left-0 h-full w-full bg-black/50 z-80"></div>
    <div class="fixed top-0 left-0 flex h-full w-full items-center justify-center z-80">
      <!-- Modal 整體 -->
      <div class="max-h-90vh rounded-10px relative overflow-hidden bg-white z-80" :class="props.width ? `${props.width}` : 'w-90% md:w-600px'">
        <!-- Modal Header -->
        <div class="px-20px py-10px sticky top-0 left-0 flex items-center justify-between">
          <h2 class="text-6 fw-700 select-none text-black" :class="titleClass">{{ props.title }}</h2>
          <img @click.prevent="closeModal" class="w-8 mx-2 my-2 p-2 cursor-pointer" src="/close.svg" alt="close">
        </div>
        <!-- Modal Body -->
        <div class="max-h-70vh w-full overflow-y-auto" >
          <slot ></slot>
        </div>
      </div>
    </div>
  </section>
</template>
