<template>
  <section class="login-page">
    <div class="login-card">
      <h2>Iniciar sesion</h2>
      <p class="subtitle">Ingresa tus credenciales para continuar.</p>

      <form class="login-form" @submit.prevent="handleLogin">
        <label for="email">Correo</label>
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="ejemplo@correo.com"
          required
        />

        <label for="password">Contrasena</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="Ingresa tu contrasena"
          required
        />

        <button type="submit">Ingresar</button>
      </form>

      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')

const store = useStore()
const router = useRouter()
const route = useRoute()

async function handleLogin() {
  error.value = ''

  try {
    await store.dispatch('login', {
      email: email.value,
      password: password.value
    })

    const redirectTo = route.query.redirect || '/'
    router.push(redirectTo)
  } catch (e) {
    error.value = e.message
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 16px;
  background: linear-gradient(180deg, #e9efff 0%, #f8faff 100%);
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 10px 28px rgba(28, 56, 122, 0.15);
  padding: 28px 22px;
  text-align: left;
}

h2 {
  margin: 0 0 6px;
  color: #1e3a8a;
}

.subtitle {
  margin: 0 0 18px;
  color: #4b5563;
}

.login-form {
  display: grid;
  gap: 10px;
}

label {
  font-size: 14px;
  font-weight: 600;
}

input {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #1d4ed8;
  box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.15);
}

button {
  margin-top: 8px;
  border: none;
  border-radius: 8px;
  padding: 11px;
  background: #1d4ed8;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

button:hover {
  background: #1e40af;
}

.error {
  margin-top: 14px;
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  border-radius: 8px;
  padding: 10px;
}
</style>