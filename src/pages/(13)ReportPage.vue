<script>
import MyMenu from "../components/ForMenu/MyMenu.vue";

export default {
  name: 'Informes',
  components: {
    MyMenu,
  },
  data() {
    return {
      user: null,
    };
  },
  methods: {
    onRegister(event, name) {
      event.preventDefault();
      this.user = { name, id: this.uid() };  // Asumiendo que `uid()` es una función existente
    },
    uid() {
      // Implementa tu propia lógica de generación de ID si no existe `uid()`
      return Math.random().toString(36).substr(2, 9);
    }
  }
};
</script>

<template>
  <div class="container">
    <!-- Barra lateral izquierda -->
    <MyMenu class="MyMenu"></MyMenu>

    <!-- Contenedor de usuarios y contenido principal -->
    <div class="content-container">
      <!-- Buscador y lista de usuarios (lado izquierdo) -->
      <div class="user-panel">
        <input type="text" class="search-box" placeholder="Buscar...">
        <ul class="user-list">
          <li class="user-item">
            <div class="user-avatar"></div>
            <span>Diego Alonso</span>
          </li>
          <li class="user-item">
            <div class="user-avatar"></div>
            <span>Manuel Echeverría</span>
          </li>
          <li class="user-item">
            <div class="user-avatar"></div>
            <span>Oscar Arias</span>
          </li>
          <li class="user-item">
            <div class="user-avatar"></div>
            <span>Andrea Santiesteban</span>
          </li>
          <li class="user-item">
            <div class="user-avatar"></div>
            <span>Marcelo Scerpella</span>
          </li>
        </ul>
      </div>

      <!-- Contenido principal (lado derecho) -->
      <div class="main-content">
        <h1 class="title">Crea tus horarios personalizados</h1>
        <div class="card">
          <h2>HORAS REGISTRADAS</h2>
          <div class="content">
            <div class="hours-info">
              <div>
                <span style="color: #4CAF50;">● HORAS TRABAJADAS:</span>
                <span>24h 44m</span>
              </div>
              <div>
                <span style="color: #FFA500;">● DESCANSOS: </span>
                <span>1h 19m</span>
              </div>
              <div>
                <span style="color: #FF0000;">● HORAS EXTRAS: </span>
                <span>0h 0m</span>
              </div>
            </div>
            <div class="chart">
              <img
                  src="https://dr282zn36sxxg.cloudfront.net/datastreams/f-d%3A04f984f46d7054451434625900769adc41bd41c00234316533a1d634%2BIMAGE_TINY%2BIMAGE_TINY.1"
                  alt="Gráfico de horas registradas"
                  class="chart-image"
              />
            </div>
          </div>
        </div>
        <div class="card">
          <h2 class="small-title">HORARIO</h2>
          <table>
            <thead>
            <tr>
              <th class="day">L</th>
              <th class="day">M</th>
              <th class="day">M</th>
              <th class="day">J</th>
              <th class="day">V</th>
              <th class="day">S</th>
              <th class="day">D</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td class="small-text">8:00 am<br>5:00 pm<br>Virtual</td>
              <td class="small-text">8:00 am<br>5:00 pm<br>Virtual</td>
              <td class="small-text">8:00 am<br>5:00 pm<br>Virtual</td>
              <td class="small-text">8:00 am<br>5:00 pm<br>Virtual</td>
              <td class="small-text">9:00 am<br>12:30 pm<br>Presencial</td>
              <td class="small-text">Descanso</td>
              <td class="small-text">Descanso</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos generales */

body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
}

.container {
  display: flex;
  height: 100vh;
}

/* Estilos para el contenedor de contenido principal */
.content-container {
  display: flex;
  flex-grow: 1;
}

/* Panel de usuarios (lado izquierdo) */
.user-panel {
  width: 250px;
  background-color: #ffffff;
  padding: 20px;
  box-shadow: -1px 0 5px rgba(0, 0, 0, 0.1);
  border-right: 1px solid #d3d3d3;
}

.search-box {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.user-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #d3d3d3;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background-color: #ddd;
  border-radius: 50%;
  margin-right: 10px;
}

/* Contenido principal (lado derecho) */
.main-content {
  flex-grow: 1;
  padding: 20px;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
}

/* Tarjeta de horas registradas */
.card {
  padding: 20px;
  background-color: #fff;
  border: 1px solid #d3d3d3;
  border-radius: 8px;
  margin-bottom: 20px;
}

.hours-info {
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-bottom: 20px;
  margin-top: 2em;
}

.hours-info > div {
  margin-bottom: 5px;
}

.content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.chart {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-grow: 1;
  margin-top: -10px;
  margin-left: -360px;
}

.chart-image {
  max-width: 100%;
  border: 1px solid #d3d3d3;
}

/* Tabla del horario */
table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #d3d3d3;
}

th, td {
  text-align: center;
  padding: 10px;
  border: 1px solid #d3d3d3;
}

.day {
  font-weight: bold;
}

.small-text {
  font-size: 14px;
}
.small-title {
  margin-top: -4px;
}
</style>
