<template>
  <Selector v-if="token !== null" />
  <Preview v-if="usePreview.visible" />
  <AlertCover :title="useAlert.title" :message="useAlert.message" :type="useAlert.type" v-if="useAlert.visible" />
  <ModalCover :title="useModal.title" :message="useModal.message" v-if="useModal.visible" />
  <div v-if="useLoading.visible" class="loading loading-cover">
    <div class="loading-box">
      <img src="@/assets/tepi-loading.svg" alt="loading animation" style="height: 50px; width: 50px;">
    </div>
  </div>
  <div class="container">
    <div class="container-left">
      <div class="left-top">
        <img class="logo" src="@/assets/tanzania-coat.png" :alt="$t('shared.logo.alt')">
        <PageTitle v-if="token == null" :title="$t('login.left.heading')" :prompt="$t('login.left.prompt')" />
        <PageTitle v-else :title="$t('upload.left.heading')" :prompt="$t('upload.left.prompt')" />
        <nav class="main-links" v-if="token !== null">
          <RouterLink v-if="usePath.name !== 'instructions'" to="/instructions" class="routerlink"
            @click="usePath.changeName('instructions')">{{ $t('shared.link.howto') }}
          </RouterLink>
          <RouterLink v-if="usePath.name !== 'upload' && usePath.name !== 'home'" to="/upload" class="routerlink"
            @click="usePath.changeName('upload')">{{ $t('shared.link.upload') }}</RouterLink>
          | <a href="/liftup/" class="routerlink"
            @click="useToken.removeToken(), useUserUploadStats.removeUserUploadStats()">{{
              $t('shared.link.logout')
            }}</a>
        </nav>
      </div>
      <UserStats v-if="token !== null"></UserStats>
      <br>
    </div>
    <div class="container-right-clients" v-if="useMode.mode == 'clients'">
      <ModeTitle v-if="token !== null && usePath.name == 'upload'" />
      <RouterView />
    </div>
    <div class="container-right-contacts" v-else-if="useMode.mode == 'contacts'">
      <ModeTitle v-if="token !== null && usePath.name == 'upload'" />
      <RouterView />
    </div>
    <div class="container-right-results" v-else>
      <ModeTitle v-if="token !== null && usePath.name == 'upload'" />
      <RouterView />
    </div>
  </div>
  <footer>
    <a @click.prevent="useLocale.changeLanguage('en')">English</a> |
    <a @click.prevent="useLocale.changeLanguage('sw')">Kiswahili</a>
  </footer>
</template>

<script setup>
import { computed, ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router'

import PageTitle from '@/components/PageTitle.vue'
import { useToken, useAlert, useModal, useLoading, useLocale, usePreview, usePath, useMode } from '@/stores/state';
import { useUserUploadStats } from '@/stores/stats';
import AlertCover from '@/components/ui/AlertCover.vue';
import ModalCover from '@/components/ui/ModalCover.vue';
import ModeTitle from '@/components/ui/ModeTitle.vue';
import Preview from '@/components/ui/Preview.vue';
import Selector from '@/components/ui/SelectorTab.vue';
import UserStats from './components/UserStats.vue';

const token = computed(() => useToken.token);

</script>

<style scoped>
.container-left {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  place-content: center;
  align-items: center;
  background-color: var(--color-panel-left);
  text-align: center;
  border-radius: 20px 0 0 20px;
}

.left-top {
  padding-top: 80px;
}

.container-right-clients {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background-color: var(--color-tab-left);
  border-radius: 0 20px 20px 0;
}

.container-right-contacts {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background-color: var(--color-tab-mid);
  border-radius: 0 20px 20px 0;
}

.container-right-results {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background-color: var(--color-tab-right);
  border-radius: 0 20px 20px 0;
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
  margin: 5px;
  font-size: 1.1em;
}

.main-links .routerlink {
  width: 100px;
}

.left-link::after {
  content: ' | ';
  color: grey;
}

@media (min-width: 1025px) {
  .container-left {
    padding-top: 30px;
  }

  .container-left img {
    margin: 5px;
    height: 120px;
    width: 120px;
  }

  .main-links {
    margin-top: 20px;
  }
}

@media (max-width: 1024px) {

  main {
    padding: 20px;
  }

  .container-left {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    text-align: center;
  }

  .container-left img {
    margin: 5px;
    height: 80px;
    width: 80px;
  }

  .main-links {
    width: auto;
  }

  .main {
    width: 60%;
    min-width: 600px;
  }

}
</style>
