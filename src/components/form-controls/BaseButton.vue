<template>
  <button
    type="button"
    class="relative inline-flex h-8 cursor-pointer items-center justify-center rounded border border-border bg-white px-[15px] text-sm leading-none whitespace-nowrap text-text-regular transition-transform duration-1000 select-none enabled:hover:border-primary-border enabled:hover:bg-primary-light enabled:hover:text-primary enabled:active:border-primary disabled:cursor-not-allowed disabled:border-border-light disabled:text-text-disabled"
  >
    <slot />
  </button>
</template>
