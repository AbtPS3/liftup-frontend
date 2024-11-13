<template>
  <div class="top-barchart">
    <BarChart :barData="barData" />
  </div>
  <hr>
  <div class="mid-piecharts">
    <div class="piechart">
      <PieChart :data="dodomaRecords" />
    </div>
    <div class="piechart">
      <PieChart :data="mbeyaRecords" />
    </div>
    <div class="piechart">
      <PieChart :data="mwanzaRecords" />
    </div>
  </div>
  <hr>
  <div class="bottom-infographs">
    <div class="infograph">
      <InfoGraph :infoData=dodomaInfoData>Dodoma Infograph</InfoGraph>
    </div>
    <div class="infograph">
      <InfoGraph :infoData=mbeyaInfoData>Mbeya Infograph</InfoGraph>
    </div>
    <div class="infograph">
      <InfoGraph :infoData=mwanzaInfoData>Mwanza Infograph</InfoGraph>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import BarChart from './charts/BarChart.vue';
import PieChart from './charts/PieChart.vue';
import InfoGraph from './charts/InfoGraph.vue';

const adminUploadStats = JSON.parse(localStorage.getItem("adminUploadStats") || {});
// const adminUploadStats = computed(() => JSON.parse(localStorage.getItem("adminUploadStats") || {}));

// Define chart data and title in the parent component
const dodomaRecords = ref({
  labels: ['Imported', 'Rejected'],
  datasets: [
    {
      label: 'Rows',
      backgroundColor: ['rgba(218, 215, 205, 0.8)', '#999999'],
      data: [
        adminUploadStats.totalAcceptedRecordsDodoma,
        adminUploadStats.totalRejectedRecordsDodoma
      ],
      title: 'Dodoma Records'
    }
  ]
});

const mbeyaRecords = ref({
  labels: ['Imported', 'Rejected'],
  datasets: [
    {
      label: 'Rows',
      backgroundColor: ['rgba(163, 177, 138, 0.8)', '#999999'],
      data: [
        adminUploadStats.totalAcceptedRecordsMbeya,
        adminUploadStats.totalRejectedRecordsMbeya
      ],
      title: 'Mbeya Records'
    }
  ]
});

const mwanzaRecords = ref({
  labels: ['Imported', 'Rejected'],
  datasets: [
    {
      label: 'Rows',
      backgroundColor: ['rgba(88, 129, 87, 0.8)', '#999999'],
      data: [
        adminUploadStats.totalAcceptedRecordsMwanza,
        adminUploadStats.totalRejectedRecordsMwanza
      ],
      title: 'Mwanza Records'
    }
  ]
});

const barData = {
  labels: ['Clients', 'Contacts', 'Results'],
  datasets: [
    {
      label: 'Dodoma',
      backgroundColor: 'rgba(218, 215, 205, 0.8)',
      data: [
        adminUploadStats.totalClientFilesDodoma,
        adminUploadStats.totalContactFilesDodoma,
        adminUploadStats.totalResultFilesDodoma,
      ]
    },
    {
      label: 'Mbeya',
      backgroundColor: 'rgba(163, 177, 138, 0.8)',
      data: [
        adminUploadStats.totalClientFilesMbeya,
        adminUploadStats.totalContactFilesMbeya,
        adminUploadStats.totalResultFilesMbeya,
      ]
    },
    {
      label: 'Mwanza',
      backgroundColor: 'rgba(88, 129, 87, 0.8)',
      data: [
        adminUploadStats.totalClientFilesMwanza,
        adminUploadStats.totalContactFilesMwanza,
        adminUploadStats.totalResultFilesMwanza,
      ]
    }
  ]
}

const totalFilesDodoma = adminUploadStats.totalClientFilesDodoma +
  adminUploadStats.totalContactFilesDodoma +
  adminUploadStats.totalResultFilesDodoma;

const dodomaInfoData = ref({
  heading: "Total Dodoma Files",
  bigNumber: adminUploadStats.totalClientFilesDodoma + adminUploadStats.totalContactFilesDodoma + adminUploadStats.totalResultFilesDodoma
});

const mbeyaInfoData = ref({
  heading: "Total Mbeya Files",
  bigNumber: adminUploadStats.totalClientFilesMbeya + adminUploadStats.totalContactFilesMbeya + adminUploadStats.totalResultFilesMbeya
});

const mwanzaInfoData = ref({
  heading: "Total Mwanza Files",
  bigNumber: adminUploadStats.totalClientFilesMwanza + adminUploadStats.totalContactFilesMwanza + adminUploadStats.totalResultFilesMwanza
});

</script>


<style scoped>
.top {
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
  padding-bottom: 10px;
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