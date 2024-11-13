<template>
  <div class="top-barchart">
    <BarChart />
  </div>
  <hr>
  <div class="mid-piecharts">
    <div class="piechart">
      <PieChart :data="dodomaData" />
    </div>
    <div class="piechart">
      <PieChart :data="mbeyaData" />
    </div>
    <div class="piechart">
      <PieChart :data="mwanzaData" />
    </div>
  </div>
  <div class="bottom-infographs">
    <div class="infograph">
      Info 1
    </div>
    <div class="infograph">
      Info 2
    </div>
    <div class="infograph">
      Info 3
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import BarChart from './charts/BarChart.vue';
import PieChart from './charts/PieChart.vue';

import { useAdminUploadStats } from '@/stores/stats';

const adminUploadStats = computed(() => useAdminUploadStats.adminUploadStats || {});

// Define chart data and title in the parent component
const dodomaData = computed(() => ({
  labels: ['Imported', 'Rejected'],
  datasets: [
    {
      label: 'Rows',
      backgroundColor: ['rgba(132, 193, 126, 0.8)', '#999999'],
      data: [
        adminUploadStats.value.totalAcceptedRecordsDodoma || 0,
        adminUploadStats.value.totalRejectedRecordsDodoma || 0
      ],
      title: 'Dodoma Region'
    }
  ]
}));

console.log(adminUploadStats.value.totalRejectedRecordsDodoma)
const mbeyaData = computed(() => ({
  labels: ['Imported', 'Rejected'],
  datasets: [
    {
      label: 'Rows',
      backgroundColor: ['rgba(132, 193, 126, 0.8)', '#999999'],
      data: [
        adminUploadStats.value?.totalAcceptedRecordsMbeya || 0,
        adminUploadStats.value?.totalRejectedRecordsMbeya || 0
      ],
      title: 'Mbeya Region'
    }
  ]
}));

const mwanzaData = computed(() => ({
  labels: ['Imported', 'Rejected'],
  datasets: [
    {
      label: 'Rows',
      backgroundColor: ['rgba(132, 193, 126, 0.8)', '#999999'],
      data: [
        adminUploadStats.value?.totalAcceptedRecordsMwanza || 0,
        adminUploadStats.value?.totalRejectedRecordsMwanza || 0
      ],
      title: 'Mwanza Region'
    }
  ]
}));
</script>


<style scoped>
.top-barchart {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50%;
}

.mid-piecharts {
  display: flex;
  flex-direction: row;
  justify-items: center;
  align-items: center;
  justify-content: space-between;
}

.bottom-infographs {
  display: flex;
  flex-direction: row;
  justify-items: center;
  align-items: center;
  justify-content: space-between;
}

.piechart {
  width: 30%;
}
</style>