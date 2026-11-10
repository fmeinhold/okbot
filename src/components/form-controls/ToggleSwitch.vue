<template>
  <SwitchRoot v-model="model" class="group inline-flex h-8 cursor-pointer items-center text-sm">
    <span class="mr-2.5 text-text group-data-[state=unchecked]:text-primary">{{
      inactiveText
    }}</span>
    <span
      class="relative h-5 w-10 rounded-full bg-border transition-colors group-data-[state=checked]:bg-primary"
    >
      <SwitchThumb
        class="absolute top-0.5 left-0.5 size-4 rounded-full bg-white transition-transform data-[state=checked]:translate-x-5"
      />
    </span>
    <span class="ml-2.5 text-text group-data-[state=checked]:text-primary">{{ activeText }}</span>
  </SwitchRoot>
</template>
<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'reka-ui'

defineProps<{ activeText: string; inactiveText: string }>()

const model = defineModel<boolean>({ required: true })
</script>
