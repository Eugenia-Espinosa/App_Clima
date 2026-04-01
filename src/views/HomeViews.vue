<template>
  <div class="container">
    <h1 class="titulo">App de Clima</h1>
    <h2 class="titulo">Capitales de América</h2>

    <div class="controles">
      <input type="text" v-model="busqueda" placeholder="Buscar lugar..." class="input" />

      <select v-model="unidad" class="select">
        <option value="C">°C</option>
        <option value="F">°F</option>
      </select>
    </div>

    <div v-if="lugaresFiltrados.length === 0" class="no-result">
      No se encontró el lugar
    </div>

    <div class="grid">
      <div v-for="lugar in lugaresFiltrados" :key="lugar.id" class="card">
        <h3>{{ lugar.nombre }}</h3>
        <img :src="lugar.img" alt="imagen lugar" class="imagen-card">

        <p class="temp">
          {{ convertir(lugar.temperatura) }}°{{ unidad }}
        </p>

        <p class="estado">
          <span class="estado-icono">{{ iconoEstado(lugar.estado) }}</span>
          {{ lugar.estado }}
        </p>

        <router-link :to="{ path: `/lugar/${lugar.id}`, query: { unidad } }" class="btn">
          Ver detalle
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { lugares } from '../data/lugares'

const busqueda = ref('')
const unidadPublica = ref('C')
const store = useStore()

const isAuthenticated = computed(() => store.state.isAuthenticated)
const usuario = computed(() => store.state.usuario)
const unidad = computed({
  get() {
    if (isAuthenticated.value && usuario.value?.unidad) {
      return usuario.value.unidad
    }
    return unidadPublica.value
  },
  set(value) {
    if (isAuthenticated.value) {
      store.dispatch('setUnidad', value)
      return
    }
    unidadPublica.value = value
  }
})

const lugaresFiltrados = computed(() =>
  lugares.filter(l =>
    l.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
  )
)

function convertir(temp) {
  if (unidad.value === 'F') {
    return ((temp * 9) / 5 + 32).toFixed(1)
  }
  return temp
}

function iconoEstado(estado) {
  const texto = estado.toLowerCase()
  if (texto.includes('soleado')) return '☀️'
  if (texto.includes('nublado')) return '☁️'
  if (texto.includes('lluv')) return '🌧️'
  if (texto.includes('tormenta')) return '⛈️'
  if (texto.includes('niev')) return '❄️'
  if (texto.includes('caluroso')) return '🌡️'
  return '🌤️'
}
</script>

<style scoped>
.container {
  padding: 40px;
  font-family: Arial, sans-serif;
  background-color: rgb(211, 210, 210);
  min-height: 100vh;
}

.titulo {
  text-align: center;
  color: rgb(90, 90, 90);
  margin-bottom: 30px;
}

.controles {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
}

.input,
.select {
  padding: 10px 15px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.imagen-card {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 15px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  color: black;
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.temp {
  font-size: 28px;
  font-weight: bold;
}

.estado {
  margin-bottom: 15px;
}

.estado-icono {
  font-size: 26px;
  margin-right: 6px;
  vertical-align: middle;
}

.btn {
  text-decoration: none;
  background: #1d4ed8;
  color: white;
  padding: 8px 15px;
  border-radius: 8px;
  font-weight: bold;
  transition: 0.3s;
}

.btn:hover {
  background: #1e40af;
  color: white;
}

.no-result {
  text-align: center;
  color: black;
  font-weight: bold;
}
</style>