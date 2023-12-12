<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <h2 class="left-title">UCS Lift-Up File Uploader</h2>
  <h3>
    {{ msg }}
  </h3>
</template>

<style scoped>
h3 {
  font-size: 1rem;
  font-weight: normal;
}

@media (min-width: 1024px) {

  h2,
  h3 {
    text-align: left;
  }
}
</style>
