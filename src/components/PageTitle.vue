<script setup>
defineProps({
  title: { type: String, required: true },
  prompt: { type: String, required: true },
})
</script>

<template>
  <div class="title">
    <h2 class="page-heading">{{ title }}</h2>
    <h3 class="page-prompt">{{ prompt }}</h3>
  </div>
</template>

<style scoped>
.title {
  position: relative;
  width: fit-content;
}

h2 {
  position: relative;
  margin-top: 10px;
  font-size: 1.3rem;
  font-weight: 600;
}

h3 {
  font-size: 1.2rem;
}

.title h2,
.title h3 {
  text-align: center;
}

@media (min-width: 1025px) {

  h2,
  h3 {
    padding-top: 20px;
  }
}

@media (max-width: 1024px) {

  .title h2,
  .title h3 {
    text-align: inherit;
  }

  h2 {
    font-size: 1.2rem;
  }

  h3 {
    font-size: 1.1rem;
  }
}
</style>
