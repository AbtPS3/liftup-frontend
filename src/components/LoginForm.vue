
<template>
  <div class="form-group">
    <p class="upload-heading">{{ $t('login.right.heading') }}</p>
    <form @submit.prevent="login">
      <FormInput type="text" :label="$t('login.right.input.username.label')" field="username" v-model=username />
      <FormInput type="password" :label="$t('login.right.input.password.label')" field="password" v-model=password />
      <FormButton :value="$t('login.right.input.button.value')" type="input-btn large-text" />
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

import { useRouter } from 'vue-router';
import { useToken, useLoading, usePath } from '@/stores/state';
import showAlert from '@/scripts/showAlert';
import FormInput from '@/components/ui/FormInput.vue';
import FormButton from '@/components/ui/FormButton.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const username = ref('');
const password = ref('');
const router = useRouter();

const login = async () => {
  // Check if already loading
  if (useLoading.visible) return;

  // Set loading to true
  useLoading.toggleVisibility(true);

  // Check if username or password is empty
  if (username.value === '' || password.value === '') {
    // Reset loading on validation failure
    useLoading.toggleVisibility(false);
    showAlert("alert-warning", t('login.alerts.credentials.title'), t('login.alerts.credentials.text'));
    return; // Return early if validation fails
  }

  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const backendPort = import.meta.env.VITE_BACKEND_PORT;
    const backendAddress = backendUrl + ":" + backendPort + "/api/v1/authentication/login";
    const response = await axios.post(backendAddress, {
      username: username.value,
      password: password.value,
    });

    // Store the token in Vue store
    const token = response.data.payload.token;
    useToken.setToken(token);
    usePath.changeName('upload');

    // Redirect the user to /uploads route
    await router.push('/upload');
  } catch (error) {
    // Set the error message for alerts
    const errorMessage = error.message || t('login.alerts.error.text');
    useLoading.toggleVisibility(false);
    showAlert("alert-error", t('login.alerts.error.title'), errorMessage);
  } finally {
    // Reset loading on completion (success or failure)
    useLoading.toggleVisibility(false);
  }
};
</script>

<style>
.upload-heading {
  font-size: 1.1rem;
  color: var(--mq-green-soft);
}

form {
  width: 80%;
}

.form-group {
  position: relative;
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  overflow: hidden;
}

.input-mid {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 5%;
}

.input-group-tall {
  position: relative;
  display: flex;
  margin-top: 5%;
}

.input-group label {
  font-size: 0.9em;
  color: #999;
  padding: 0 0 5px 10px;
}

.input-group input {
  height: 50px;
  border-radius: 5px;
  border: 1px solid #c3c3c3;
  font-size: 0.9em;
  padding-left: 15px;
}

.input-group .large-text {
  font-size: 1.1em;
}

.input-group input:focus {
  border: 1px solid #989898;
  outline: none !important;
  color: #333;
}

.input-btn {
  position: relative;
  margin-top: 10%;
  cursor: pointer;
  height: 40px;
  border-radius: 5px;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  font-size: 1.2em;
  background-color: var(--color-background-soft);
}

.input-btn:hover {
  background-color: var(--color-background);
  border: 1px solid var(--color-border-hover);
}

@media (max-width: 1024px) {
  .form-group {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: fit-content;
    min-width: 350px;
    max-width: 800px;
  }

  .input-mid {
    margin-top: 5px;
  }

  .input-group-tall {
    margin-top: 5px;
  }

  .input-group label {
    padding: 0 0 2px 5px;
  }

  .input-group input {
    height: 40px;
    font-size: 0.7em;
  }

  .input-btn {
    margin-top: 20px;
  }
}
</style>
