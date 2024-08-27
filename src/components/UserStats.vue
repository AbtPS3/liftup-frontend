<script setup>
import { computed } from 'vue';
import { useI18n } from "vue-i18n";

import { useUserUploadStats } from '@/stores/stats';
import IconClientFile from './icons/IconClientFile.vue';
import IconContactFile from './icons/IconContactFile.vue';
import IconResultFile from './icons/IconResultFile.vue';
import IconAcceptedRecords from './icons/IconAcceptedRecords.vue';
import IconRejectedRecords from './icons/IconRejectedRecords.vue';
import IconLastUploadDate from './icons/IconLastUploadDate.vue';

const userUploadStats = computed(() => useUserUploadStats.userUploadStats);
const { t } = useI18n();

</script>

<template>
  <div class="user-stats">
    <div class="top-spacer"></div>
    <div class="bottom-content">
      <div class="user-stat stat1">
        {{ $t('shared.stats.clients') }}
        <br>
        <IconClientFile class=" icon icon1" />
        <br>
        <span class="stat-data stat-data1">{{ userUploadStats.clientFiles }}</span>
      </div>
      <div class="user-stat stat2">
        {{ $t('shared.stats.contacts') }}
        <br>
        <IconContactFile class="icon icon2" />
        <br>
        <span class="stat-data stat-data2">{{ userUploadStats.contactFiles }}</span>
      </div>
      <div class="user-stat stat3">
        {{ $t('shared.stats.results') }}
        <br>
        <IconResultFile class="icon icon3" />
        <br>
        <span class="stat-data stat-data3">{{ userUploadStats.resultFiles }}</span>
      </div>
      <div class="user-stat stat4">
        {{ $t('shared.stats.accepted') }}
        <br>
        <IconAcceptedRecords class="icon icon4" />
        <br>
        <span class="stat-data stat-data4">{{ userUploadStats.acceptedRecords }}</span>
      </div>
      <div class="user-stat stat5">
        {{ $t('shared.stats.rejected') }}
        <br>
        <IconRejectedRecords class="icon icon5" />
        <br>
        <span class="stat-data stat-data5">{{ userUploadStats.rejectedRecords }}</span>
      </div>
      <div class="user-stat stat6">
        {{ $t('shared.stats.lastDate') }}
        <br>
        <IconLastUploadDate class="icon icon6" />
        <br>
        <!-- {{ new Date(userUploadStats.lastUploadDate).toLocaleString() }} -->
        <span class="stat-data stat-data6">
          {{ new Date(userUploadStats.lastUploadDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
        </span>

      </div>
    </div>
  </div>
</template>

<style scoped>
.user-stats {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 10px;
}

.top-spacer {
  height: 150px;
}

.bottom-content {
  position: relative;
  text-align: center;
  padding-bottom: 50px;
  display: flex;
  flex-direction: row;
  font-size: smaller;
}

.user-stat {
  padding: 10px 3px;
}

.icon {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  border: solid 2px white;
  margin: 20px 0;
  box-shadow: 2px 1px 1px grey;
}

.stat-data {
  font-size: large;
  font-weight: bold;
  box-shadow:
    0 -4px 3px -4px rgba(0, 0, 0, 0.3),
    0 4px 3px -4px rgba(0, 0, 0, 0.3);
  padding: 5px 2px;
}

.icon1 {
  background-color: #19BAB7;
  color: whitesmoke;
}

.stat-data1 {
  color: #19BAB7;
}

.icon2 {
  background-color: #32625E;
  color: whitesmoke;
  padding: 2px;
}

.stat-data2 {
  color: #32625E;
}

.icon3 {
  background-color: #8B9E1D;
  color: whitesmoke;
  padding: 5px;
}

.stat-data3 {
  color: #8B9E1D;
}

.icon4 {
  background-color: #236a0b;
  color: whitesmoke;
  padding: 2px;
}

.stat-data4 {
  color: #236a0b;
}

.icon5 {
  background-color: #C04337;
  color: whitesmoke;
  padding: 2px;
}

.stat-data5 {
  color: #C04337;
}

.icon6 {
  background-color: #512807;
  color: whitesmoke;
  padding: 3px;
}

.stat-data6 {
  color: #512807;
  font-size: 1.5em;
  font-weight: bolder;
  text-orientation: sideways-right;
  transform: rotate(-90deg);
}
</style>
