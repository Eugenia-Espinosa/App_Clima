<template>
  <div v-if="ciudad" class="detalle">
    <h2>{{ ciudad.capital }}</h2>
    <img :src="`/img/${ciudad.img}`" :alt="ciudad.capital" class="imagen" />

    <div v-if="clima">
      <p>
        Estado:
        <span class="estado-icono">{{ weatherCodeToIcono(clima.weatherCode) }}</span>
        {{ clima.estado }}
      </p>
      <p>Temperatura: {{ convertir(clima.temperatura) }}°{{ unidad }}</p>

      <div class="pronostico">
        <h3>Pronostico semanal</h3>
        <p class="promedio">
          Promedio semanal:
          Min {{ convertir(promedioMin) }}°{{ unidad }} -
          Max {{ convertir(promedioMax) }}°{{ unidad }}
        </p>
        <p class="estado-frecuente">
          Estado predominante: {{ estadoMasFrecuente(clima.pronostico) }}
        </p>
        <div class="pronostico-grid">
          <div v-for="dia in clima.pronostico" :key="dia.dia" class="dia-card">
            <strong>{{ dia.dia }}</strong>
            <span class="dia-icono">{{ weatherCodeToIcono(dia.weatherCode) }}</span>
            <span class="dia-estado">{{ weatherCodeToEstado(dia.weatherCode) }}</span>
            <span>Min {{ convertir(dia.min) }}°{{ unidad }}</span>
            <span>Max {{ convertir(dia.max) }}°{{ unidad }}</span>
          </div>
        </div>
      </div>
    </div>

    <p v-else class="cargando">Cargando datos del clima...</p>

    <button class="boton-fav" v-if="isAuthenticated" @click="toggleFavorito">
      {{ esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos' }}
    </button>

    <div class="acciones">
      <router-link to="/" class="btn-home">← Volver al inicio</router-link>
    </div>
  </div>

  <p v-else>Lugar no encontrado.</p>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { ciudades } from '../data/ciudades'
import { weatherCodeToIcono, weatherCodeToEstado, estadoMasFrecuente } from '../services/climaService'

const route = useRoute()
const store = useStore()

const ciudadId = computed(() => Number(route.params.id))
const ciudad = computed(() => ciudades.find(c => c.id === ciudadId.value))
const clima = computed(() => store.state.climaData[ciudadId.value])
const isAuthenticated = computed(() => store.state.isAuthenticated)
const usuario = computed(() => store.state.usuario)
const unidad = computed(() => usuario.value?.unidad || route.query.unidad || 'C')
const esFavorito = computed(() => usuario.value?.favoritos?.includes(ciudadId.value))

const promedioMin = computed(() => {
  if (!clima.value?.pronostico?.length) return 0
  const total = clima.value.pronostico.reduce((acc, dia) => acc + dia.min, 0)
  return (total / clima.value.pronostico.length).toFixed(1)
})

const promedioMax = computed(() => {
  if (!clima.value?.pronostico?.length) return 0
  const total = clima.value.pronostico.reduce((acc, dia) => acc + dia.max, 0)
  return (total / clima.value.pronostico.length).toFixed(1)
})

function convertir(temp) {
  if (unidad.value === 'F') {
    return ((temp * 9) / 5 + 32).toFixed(1)
  }
  return temp
}

function toggleFavorito() {
  store.dispatch('toggleFavorito', ciudadId.value)
}

onMounted(() => {
  store.dispatch('cargarClimas')
})
</script>

<style scoped>
.detalle {
  min-height: 100vh;
  padding: 24px;
}

.imagen {
  max-width: 480px;
  width: 100%;
  border-radius: 12px;
}

.pronostico {
  margin: 20px auto;
  max-width: 480px;
  text-align: center;
}

.promedio {
  font-weight: 600;
}

.estado-frecuente {
  font-weight: 600;
  color: #2c3e50;
}

.pronostico-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}

.dia-card {
  background:rgb(243, 243, 243);
  border-radius: 10px;
  padding: 12px 10px;
  flex: 1 1 80px;
  min-width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  text-align: center;
}

.dia-icono {
  font-size: 28px;
}

.dia-estado {
  font-size: 11px;
  color: #333333;
}

.estado-icono {
  font-size: 30px;
  margin: 0 6px;
  vertical-align: middle;
}
.boton-fav {
  margin-top: 16px;
  border: none;
  border-radius: 6px;
  padding: 8px 10px;
  cursor: pointer;
  background: #1d4ed8;
  color: #fff;
}
button:hover {
  background: #1e40af;
}
.cargando {
  color: #888;
  font-style: italic;
}

.acciones {
  margin-top: 24px;
}

.btn-home {
  text-decoration: none;
  background: #6b7280;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: bold;
  transition: 0.3s;
}

.btn-home:hover {
  background: #4b5563;
}
</style>
