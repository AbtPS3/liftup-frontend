<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { ref, defineProps } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// Props for dynamic data hapa
const props = defineProps({
  barData: {
    type: Object,
    required: true
  }
})


// Define reactive chart data and options
const chartData = ref(props.barData);

const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'top'
    },
    title: {
      display: true,
      text: 'FIle Uploads by Type by Region'
    }
  }
})
</script>
