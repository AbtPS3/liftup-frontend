<template>
  <div class="info-graph">
    <span class="heading">{{ heading }}</span>
    <br>
    <span class="big-number">{{ bigNumber }}</span>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'


// Props for dynamic data hapa
const props = defineProps({
  infoData: {
    type: Object,
    required: true
  }
})

const heading = ref(props.infoData.heading);
const bigNumber = ref(props.infoData.bigNumber);

</script>

<style scoped>
.info-graph {
  margin: 10px 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  border: solid 1px #fff;
}

.heading {
  color: #666;
  font-weight: normal;
  font-size: 1em;
}

.big-number {
  color: #999;
  color: var(--color-border);
  font-weight: bold;
  font-size: 3em;
  font-family: Arial, Helvetica, sans-serif;
}
</style>
