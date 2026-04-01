const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export function weatherCodeToEstado(code) {
  if (code === 0) return 'Despejado'
  if (code <= 2) return 'Parcialmente nublado'
  if (code === 3) return 'Nublado'
  if (code <= 49) return 'Niebla'
  if (code <= 59) return 'Llovizna'
  if (code <= 69) return 'Lluvia'
  if (code <= 79) return 'Nieve'
  if (code <= 82) return 'Lluvia intensa'
  if (code <= 86) return 'Nevada intensa'
  if (code <= 99) return 'Tormenta'
  return 'Desconocido'
}

export function weatherCodeToIcono(code) {
  if (code === 0) return '☀️'
  if (code <= 2) return '🌤️'
  if (code === 3) return '☁️'
  if (code <= 49) return '🌫️'
  if (code <= 59) return '🌦️'
  if (code <= 69) return '🌧️'
  if (code <= 79) return '❄️'
  if (code <= 82) return '🌧️'
  if (code <= 86) return '❄️'
  if (code <= 99) return '⛈️'
  return '🌤️'
}

export function estadoMasFrecuente(pronostico) {
  if (!pronostico?.length) return ''
  const conteo = {}
  for (const dia of pronostico) {
    conteo[dia.weatherCode] = (conteo[dia.weatherCode] || 0) + 1
  }
  const codeMasFrecuente = Object.keys(conteo).reduce((a, b) =>
    conteo[a] >= conteo[b] ? a : b
  )
  return weatherCodeToEstado(Number(codeMasFrecuente))
}

export async function fetchClima(ciudad) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${ciudad.lat}&longitude=${ciudad.long}&daily=weather_code,temperature_2m_max,temperature_2m_min&current=temperature_2m,weather_code&timezone=auto`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Error al obtener clima para ${ciudad.capital}`)
  const data = await res.json()

  const pronostico = data.daily.time.map((fecha, i) => {
    const date = new Date(fecha + 'T00:00:00')
    return {
      dia: DIAS[date.getDay()],
      min: data.daily.temperature_2m_min[i],
      max: data.daily.temperature_2m_max[i],
      weatherCode: data.daily.weather_code[i]
    }
  })

  return {
    temperatura: data.current.temperature_2m,
    weatherCode: data.current.weather_code,
    estado: weatherCodeToEstado(data.current.weather_code),
    pronostico
  }
}
