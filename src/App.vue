<script setup>
import { computed } from "vue";
import { RouterView } from "vue-router"
import { useAlert } from "@/stores/store";
import NavTitle from "./components/NavTitle.vue";
import Alert from "./components/Alert.vue";
import { useToken } from '@/stores/store';
import { useLoading } from '@/stores/store';

const token = computed(() => useToken.token);
</script>

<template>
  <Alert :title="useAlert.title" :message="useAlert.message" :type="useAlert.type" v-if="useAlert.visible" />
  <div v-if="useLoading.visible" class="loading loading-cover">
    <div class="loading-box">Loading...</div>
  </div>
  <div class="container">
    <div class="container-left">
      <img class="logo" src="@/assets/tanzania-coat.png" alt="Tanzania Coat of Arms" width="100" height="100">
      <NavTitle v-if="token == null" msg="Use the form on the right to login." />
      <NavTitle v-else msg="Upload CSV files on the right." />
      <nav class="main-links">
        <!-- <RouterLink to="/" class="routerlink">Login</RouterLink> |
        <RouterLink to="/upload" class="routerlink">Upload</RouterLink> -->
        <a v-if="token != null" href="/" class="routerlink" @click="useToken.removeToken()">Logout</a>
      </nav>
    </div>
    <div class="container-right">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.container-left {
  position: relative;
  height: 60%;
  width: 45%;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

.container-right {
  position: relative;
  height: 100%;
  width: 55%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background-color: #e2e2e2;
}

main {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10%;
}

.logo {
  margin-top: 5%;
}

.left-title {
  position: relative;
  height: 10%;
  margin-top: 10%;
}

.main-links {
  height: 15%;
  margin-top: 10%;
}

.main-links .routerlink {
  width: 100px;
}
</style>
