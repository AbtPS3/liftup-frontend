<template>
  <main>
    <h2>{{ t('shared.link.howto') }}</h2>
    <hr class="tepi-border">
    <br>
    <span class="instruction-entry">

      <h3 class="instruction-heading">{{ t('instructions.section1.title') }}</h3>
      <p class="text-large">{{ t('instructions.section1.text') }}</p>
      <br>
    </span>

    <span class="instruction-entry">
      <h3 class="instruction-heading">{{ t('instructions.section2.title') }}</h3>
      <p class="text-large">{{ t('instructions.section2.text') }}</p>
      <br>

    </span>

    <span class="instruction-entry">

      <h3 class="instruction-heading">{{ t('instructions.section3.title') }}</h3>
      <p class="text-large">{{ t('instructions.section3.text') }}</p>
      <br>
      <div class="tabbed-text">
        <p><span class="heavy-text">{{ t('instructions.headers.clients') }}</span></p>
        <p><span class="mono-text" v-for="header in indexHeaders" :key="header">{{ header + ", " }}</span></p>
        <br>
        <p><span class="heavy-text">{{ t('instructions.headers.contacts') }}</span></p>
        <p><span class="mono-text" v-for="header in contactsHeaders" :key="header">{{ header + ", " }}</span></p>
      </div>
    </span>

  </main>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const indexHeaders = import.meta.env.VITE_CSV_CLIENTS_HEADERS.split(",");
const contactsHeaders = import.meta.env.VITE_CSV_CONTACTS_HEADERS.split(",");
</script>

<style>
.tepi-border {
  color: black;
  border: 1px solid var(--color-border);
}

.instruction-entry {
  margin-top: 3px;
}

.instruction-heading {
  font-weight: bold;
  font-size: 1.1em;
  margin-bottom: 3px;
  text-decoration: underline;
}

.text-large {
  font-size: 1em;
}

.heavy-text {
  font-weight: bold;
  font-style: oblique;
}

.mono-text {
  font-family: monospace;
}

.tabbed-text {
  margin: 10px 20px 0 20px;
  text-align: justify;
  font-size: 0.9rem;
}
</style>