<template>
  <div class="container">
    <h2>Mis favoritos</h2>

    <p v-if="favoritos.length === 0">Aun no tienes lugares favoritos.</p>

    <div v-else class="grid" :class="{ 'grid-one': favoritos.length === 1 }">
      <div v-for="ciudad in favoritos" :key="ciudad.id" class="card">
        <h3>{{ ciudad.capital }}</h3>
        <img :src="`/img/${ciudad.img}`" :alt="ciudad.capital" class="imagen" />

        <div v-if="climaData[ciudad.id]">
          <p>
            <span class="estado-icono">{{ weatherCodeToIcono(climaData[ciudad.id].weatherCode) }}</span>
            {{ climaData[ciudad.id].estado }}
          </p>
          <p class="actual">Temperatura: {{ convertir(climaData[ciudad.id].temperatura) }}°{{ unidad }}</p>
          <p class="promedio">
            Promedio semanal:
            Min {{ convertir(promedioMin(ciudad.id)) }}°{{ unidad }} -
            Max {{ convertir(promedioMax(ciudad.id)) }}°{{ unidad }}
          </p>
          <p class="estado-frecuente">
            Estado predominante: {{ estadoMasFrecuente(climaData[ciudad.id].pronostico) }}
          </p>

          <div class="pronostico">
            <h4>Pronostico semanal</h4>
            <div class="pronostico-grid">
              <div v-for="dia in climaData[ciudad.id].pronostico" :key="dia.dia" class="dia-card">
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

        <button @click="quitar(ciudad.id)">Quitar de favoritos</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ciudades } from '../data/ciudades'
import { weatherCodeToIcono, weatherCodeToEstado, estadoMasFrecuente } from '../services/climaService'

const store = useStore()

const usuario = computed(() => store.state.usuario)
const unidad = computed(() => usuario.value?.unidad || 'C')
const climaData = computed(() => store.state.climaData)

const favoritos = computed(() => {
  const ids = usuario.value?.favoritos || []
  return ciudades.filter(c => ids.includes(c.id))
})

function convertir(temp) {
  if (unidad.value === 'F') {
    return ((temp * 9) / 5 + 32).toFixed(1)
  }
  return temp
}

function quitar(id) {
  store.dispatch('toggleFavorito', id)
}

function promedioMin(id) {
  const pronostico = climaData.value[id]?.pronostico
  if (!pronostico?.length) return 0
  const total = pronostico.reduce((acc, dia) => acc + dia.min, 0)
  return (total / pronostico.length).toFixed(1)
}

function promedioMax(id) {
  const pronostico = climaData.value[id]?.pronostico
  if (!pronostico?.length) return 0
  const total = pronostico.reduce((acc, dia) => acc + dia.max, 0)
  return (total / pronostico.length).toFixed(1)
}

onMounted(() => {
  store.dispatch('cargarClimas')
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  padding: 24px;
}

.grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
}

.grid-one {
  grid-template-columns: 1fr;
  justify-items: center;
  align-items: center;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  text-align: left;
}

.grid-one .card {
  width: 100%;
  max-width: 480px;
  padding: 24px;
}

.imagen {
  width: 100%;
  max-width: 480px;
  object-fit: cover;
  border-radius: 12px;
}

.actual {
  font-weight: 600;
}

.promedio {
  font-weight: 600;
}

.estado-frecuente {
  font-weight: 600;
  color: #1d4ed8;
}

.pronostico h4 {
  margin: 12px 0 8px;
}

.pronostico-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}

.dia-card {
  background: #f3f3f3;
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
  color: #555;
}

.estado-icono {
  font-size: 30px;
  margin-right: 6px;
  vertical-align: middle;
}

.cargando {
  color: #888;
  font-style: italic;
}

button {
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
</style>
