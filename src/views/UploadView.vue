<template>
  <main>
    <UploadForm v-if="userName !== 'tepifac'" />
    <AdminLanding v-else />
  </main>
</template>

<script setup>
import { ref, computed } from "vue";
import { jwtDecode } from "jwt-decode";
import { useToken } from "@/stores/state";

import UploadForm from '@/components/UploadForm.vue';
import AdminLanding from '@/components/AdminLanding.vue';

const token = computed(() => useToken.token);
const decodedJwt = jwtDecode(token.value);
const userName = ref(decodedJwt.data.providerId);
</script>