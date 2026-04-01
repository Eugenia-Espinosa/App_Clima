import { createStore } from 'vuex'
import { usuarios } from '../data/usuarios'
import { ciudades } from '../data/ciudades'
import { fetchClima } from '../services/climaService'

export default createStore({
  state: {
    usuario: null,
    isAuthenticated: false,
    climaData: {},
    cargando: false
  },

  mutations: {
    SET_USER(state, user) {
      state.usuario = {
        ...user,
        favoritos: [...(user.favoritos || [])]
      }
      state.isAuthenticated = true
    },
    LOGOUT(state) {
      state.usuario = null
      state.isAuthenticated = false
    },
    TOGGLE_FAVORITO(state, lugarId) {
      if (!state.usuario) return
      const favs = state.usuario.favoritos

      if (favs.includes(lugarId)) {
        state.usuario.favoritos = favs.filter(id => id !== lugarId)
      } else {
        favs.push(lugarId)
      }
    },
    SET_UNIDAD(state, unidad) {
      if (!state.usuario) return
      state.usuario.unidad = unidad
    },
    SET_CLIMA(state, { id, clima }) {
      state.climaData = { ...state.climaData, [id]: clima }
    },
    SET_CARGANDO(state, value) {
      state.cargando = value
    }
  },

  actions: {
    login({ commit }, { email, password }) {
      const user = usuarios.find(
        u => u.email === email && u.password === password
      )

      if (!user) {
        throw new Error('Usuario o contraseña incorrectos')
      }

      commit('SET_USER', user)
    },

    logout({ commit }) {
      commit('LOGOUT')
    },

    toggleFavorito({ commit }, lugarId) {
      commit('TOGGLE_FAVORITO', lugarId)
    },

    setUnidad({ commit }, unidad) {
      commit('SET_UNIDAD', unidad)
    },

    async cargarClimas({ commit, state }) {
      if (Object.keys(state.climaData).length > 0) return
      commit('SET_CARGANDO', true)
      await Promise.all(
        ciudades.map(async (ciudad) => {
          try {
            const clima = await fetchClima(ciudad)
            commit('SET_CLIMA', { id: ciudad.id, clima })
          } catch (e) {
            console.error(e)
          }
        })
      )
      commit('SET_CARGANDO', false)
    }
  }
})
