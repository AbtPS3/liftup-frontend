<template>
  <Pie :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { ref, defineProps } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'

// Register the necessary components for a Pie chart
ChartJS.register(Title, Tooltip, Legend, ArcElement)

// Props for dynamic data hapa
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

// Define reactive chart data and options for the Pie chart
const chartData = ref({
  labels: props.data.labels || [],
  datasets: [
    {
      label: props.data.datasets[0].label || '',
      backgroundColor: props.data.datasets[0].backgroundColor || ['rgba(255, 255, 255, 0.8)', 'rgba(000, 000, 000, 0.8)'],
      data: props.data.datasets[0].data || []
    }
  ]
})

const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      display: false
    },
    title: {
      display: true,
      text: props.data.datasets[0].title || 'Region',
    }
  }
})

// Watch for changes in props to dynamically update chart data and title
// watch(toRef(props, 'data'), (newData) => {
//   chartData.value = newData
// })


</script>
