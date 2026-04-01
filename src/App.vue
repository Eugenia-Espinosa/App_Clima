<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link v-if="isAuthenticated" to="/favoritos">Favoritos</router-link>
    <span v-if="isAuthenticated"> | Hola, {{ usuario?.nombre }}</span>
    <router-link v-else to="/login">Login</router-link>
    <button v-if="isAuthenticated" class="logout-btn" @click="handleLogout">
      Cerrar sesion
    </button>
  </nav>
  <main class="main-content">
    <router-view/>
  </main>
  <footer-componet/>
</template>
<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import FooterComponet from './components/FooterComponet.vue'

const store = useStore()
const router = useRouter()

const usuario = computed(() => store.state.usuario)
const isAuthenticated = computed(() => store.state.isAuthenticated)

function handleLogout() {
  store.dispatch('logout')
  router.push('/login')
}

</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}

nav {
  background-color: gray;
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: blue;
}

.logout-btn {
  margin-left: 12px;
  border: none;
  border-radius: 6px;
  padding: 8px 10px;
  cursor: pointer;
}
</style>
