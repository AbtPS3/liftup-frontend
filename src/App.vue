<template>
  <Preview v-if="usePreview.visible" />
  <AlertCover :title="useAlert.title" :message="useAlert.message" :type="useAlert.type" v-if="useAlert.visible" />
  <div v-if="useLoading.visible" class="loading loading-cover">
    <div class="loading-box">
      <img src="@/assets/tepi-loading.svg" alt="loading animation" style="height: 50px; width: 50px;">
    </div>
  </div>
  <div class="container">
    <div class="container-left">
      <img class="logo" src="@/assets/tanzania-coat.png" :alt="$t('shared.logo.alt')">
      <PageTitle v-if="token == null" :title="$t('login.left.heading')" :prompt="$t('login.left.prompt')" />
      <PageTitle v-else :title="$t('upload.left.heading')" :prompt="$t('upload.left.prompt')" />
      <nav class="main-links" v-if="token !== null">
        <RouterLink v-if="usePath.name !== 'instructions'" to="/instructions" class="routerlink"
          @click="usePath.changeName('instructions')">{{ $t('shared.link.howto') }}
        </RouterLink>
        <RouterLink v-if="usePath.name !== 'upload'" to="/upload" class="routerlink"
          @click="usePath.changeName('upload')">{{ $t('shared.link.upload') }}</RouterLink>
        | <a href="/" class="routerlink" @click="useToken.removeToken()">{{ $t('shared.link.logout') }}</a>
      </nav>
      <br>
    </div>
    <div class="container-right">
      <ModeSelector v-if="token !== null && usePath.name == 'upload'" />
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
import PageTitle from './components/PageTitle.vue'
import { useToken, useAlert, useLoading, useLocale, usePreview, usePath } from './stores/state';
import AlertCover from '@/components/ui/AlertCover.vue';
import ModeSelector from './components/ui/ModeSelector.vue';
import Preview from './components/ui/Preview.vue';

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
}

.container-right {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background-color: var(--color-panel-right);
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
