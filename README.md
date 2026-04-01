# App Clima - Capitales de América

Aplicación web desarrollada con **Vue 3** que muestra el clima en tiempo real de las principales capitales de América del Sur, consumiendo la API pública de [Open-Meteo](https://open-meteo.com/).

---

## Funcionalidades

- Listado de 10 capitales con temperatura actual, estado del clima e icono
- Búsqueda de ciudades en tiempo real
- Cambio de unidad de temperatura entre °C y °F
- Vista de detalle por ciudad con:
  - Temperatura y estado actual
  - Pronóstico semanal de 7 días (mín, máx, estado e icono por día)
  - Promedio semanal de temperaturas
  - Estado climático predominante de la semana
- Sistema de autenticación de usuarios
- Sección de favoritos (requiere login) con la misma información detallada

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| Vue 3 | Framework principal |
| Vue Router 4 | Navegación entre vistas |
| Vuex 4 | Manejo de estado global |
| Open-Meteo API | Datos de clima en tiempo real |
| Vue CLI | Herramienta de desarrollo |

---

## Estructura del proyecto

```
src/
├── data/
│   ├── ciudades.js       # Ciudades con coordenadas lat/long
│   └── usuarios.js       # Usuarios para autenticación
├── services/
│   └── climaService.js   # Llamadas a la API y mapeo de códigos WMO
├── store/
│   └── index.js          # Estado global (clima, auth, favoritos)
├── views/
│   ├── HomeViews.vue     # Listado principal de ciudades
│   ├── DetalleLugar.vue  # Detalle y pronóstico de una ciudad
│   ├── FavoritosViews.vue# Ciudades marcadas como favoritas
│   └── LoginViews.vue    # Formulario de login
└── router/
    └── index.js          # Rutas y guards de autenticación
```

---

## Instalación y uso

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run serve

# Build para producción
npm run build
```

---

## API utilizada

**Open-Meteo** — gratuita, sin API key requerida.

Endpoint:
```
https://api.open-meteo.com/v1/forecast
  ?latitude={lat}
  &longitude={long}
  &daily=weather_code,temperature_2m_max,temperature_2m_min
  &current=temperature_2m,weather_code
  &timezone=auto
```

Los códigos de clima (WMO) se traducen a texto en español e iconos dentro de `climaService.js`.
