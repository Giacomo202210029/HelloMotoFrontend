<script>
import AppBar from "../../components/ForMobile/AppBar.vue";
import NavBar from "../../components/ForMobile/NavBar.vue";
import { getCurrentTime } from "../../utils/time.js";
import axios from 'axios';
import Graph from "../../components/ForMobile/graph.vue";
import url from "../../services/url.service.js";

export default {
  name: "ControlPanelMovil",
  components: { Graph, NavBar, AppBar },
  data() {
    return {
      currentTime: getCurrentTime(),
      workers: [],
      registeredHours:[],
      counts: { Dentro: 0, Descanso: 0, Fuera: 0 }, // Conteos por estado
      startTime: null,
      userId: 0,
      worker: {
        id:0,
        status:0,
        latitude: 0,
        longitude: 0,
      },
      showModal: false, // Muestra el modal al cargar
      workedHoursByDay: {},
    };
  },
  mounted() {
    this.updateTime();
    setInterval(this.updateTime, 1000);
    this.loadRegisteredHours();

    // Obtener userId de localStorage
    const userId = localStorage.getItem("userId");
    if (userId) {
      this.userId = parseInt(userId, 10);
    }
    console.log(userId);


    // Cargar datos iniciales desde la API
    axios.get(`${url}data`).then(response => {
      this.workers = response.data;
      this.updateGraphData();
    }).catch(error => {
      console.error("Error al cargar trabajadores:", error);
    });
    this.fetchWorkerStatus();
    this.pollingInterval = setInterval(this.fetchWorkerStatus, 5000);


  },
  computed: {
    totalWorked() {
      return this.registeredHours.reduce((sum, record) => sum + (record.worked || 0), 0).toFixed(2);
    },
    totalBreak() {
      return this.registeredHours.reduce((sum, record) => sum + (record.break || 0), 0).toFixed(2);
    },
    totalOvertime() {
      return this.registeredHours.reduce((sum, record) => sum + (record.overtime || 0), 0).toFixed(2);
    },
  },


  methods: {
    updateTime() {
      this.currentTime = getCurrentTime();
    },

    async loadRegisteredHours() {
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const response = await axios.get(
              `${url}worker/${userId}`
          );
          const worker = response.data;

          // Obtener la fecha actual en formato YYYY-MM-DD
          const today = new Date().toISOString().slice(0, 10);
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const formattedYesterday = yesterday.toISOString().slice(0, 10);

          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const formattedTomorrow = tomorrow.toISOString().slice(0, 10);

          // Filtrar las horas registradas por la fecha actual
          this.registeredHours = worker.registeredHours.filter(
              (record) => record.date === formattedYesterday || record.date === today || record.date === formattedTomorrow
          );

          // Transformar datos para el gráfico
          this.updateGraphData();
        }
      } catch (error) {
        console.error("Error al cargar las horas registradas:", error);
      }
    },
    async getCurrentLocation(workerId) {
      if (!("geolocation" in navigator)) {
        console.error("Geolocalización no es soportada por este navegador o dispositivo.");
        alert("Geolocalización no es soportada por este navegador o dispositivo.");
        return;
      }

      console.log("Intentando obtener la ubicación para el trabajador con ID:", workerId);

      try {
        // Obtener ubicación del navegador
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000, // Tiempo máximo para obtener ubicación
            maximumAge: 0,  // No usar caché
          });
        });

        console.log("Ubicación obtenida con éxito:", position.coords);

        // Extraer latitud y longitud
        const {latitude, longitude} = position.coords;

        // Actualizar el trabajador localmente
        const worker = this.workers.find((w) => w.id === workerId);
        if (!worker) {
          console.error("Trabajador no encontrado en la lista local con el ID:", workerId);
          alert("Trabajador no encontrado.");
          return;
        }

        worker.latitude = latitude;
        worker.longitude = longitude;
        console.log("Ubicación actualizada localmente para el trabajador:", worker);

        // Enviar al backend
        const response = await axios.put(
            `${url}worker/${workerId}/location`,
            {latitude, longitude} // Cuerpo de la solicitud
        );

        console.log("Ubicación actualizada correctamente en el backend:", response.data);
      } catch (error) {
        if (error.response) {
          // Error del servidor
          console.error("Error del servidor al enviar la ubicación:", error.response.data);
        } else if (error.request) {
          // Error en la solicitud
          console.error("No se recibió respuesta del servidor:", error.request);
        } else {
          // Otro error
          console.error("Error al procesar la solicitud:", error.message);
        }
        alert("No se pudo obtener o enviar la ubicación. Verifica los permisos y la conexión.");
      }
    },


    updateGraphData() {
      const uniqueLabels = new Set();
      const labels = [];
      const data = [];

      this.registeredHours.forEach(record => {
        if (record.date && !uniqueLabels.has(record.date)) {
          labels.push(record.date); // Fecha como etiqueta
          data.push(record.worked || 0); // Horas trabajadas como dato
          uniqueLabels.add(record.date); // Evitar etiquetas duplicadas
        }
      });

      // Actualizar los datos y etiquetas para el gráfico
      this.workedHoursByDay = {labels, data};

      if (this.$refs.graph) {
        this.$refs.graph.updateChart(labels, data);
      }
    },

    async fetchWorkerStatus() {
      try {
        const response = await axios.get(
            `${url}worker/${this.userId}/status`
        );
        this.worker.status = response.data.status;
        console.log("Estado actualizado desde el servidor:", this.worker.status);
      } catch (error) {
        console.error("Error al obtener el estado del trabajador:", error);
      }
    },
    schedulepagebutton() {
      this.$router.push('/schedulepagemobile')
    },


    async changeWorkerStatus(workerId, newStatus) {
      const worker = this.workers.find((w) => w.id === workerId);
      if (worker) {
        const previousStatus = worker.status;
        const now = new Date();

        if (newStatus === 1) {
          // Iniciar trabajo
          worker.startTime = now;
          await this.getCurrentLocation(workerId);
        } else if (newStatus === 2 && worker.startTime) {
          // Terminar trabajo
          const endTime = now;
          const hoursWorked = (endTime - new Date(worker.startTime)) / (1000 * 60 * 60);

          const today = new Date().toISOString().slice(0, 10);
          const existingRecord = this.registeredHours.find((r) => r.date === today);
          if (existingRecord) {
            existingRecord.worked += hoursWorked;
          } else {
            this.registeredHours.push({
              date: today,
              worked: hoursWorked,
              break: 0,
              overtime: 0,
            });
          }
          worker.startTime = null;
        }

        if (newStatus === 3) {
          // Iniciar descanso
          worker.breakStart = now;
        } else if (newStatus === 2 && worker.breakStart) {
          const endTime = now;
          const hoursBreak = (endTime - new Date(worker.breakStart)) / (1000 * 60 * 60);

          const today = new Date().toISOString().slice(0, 10);
          const existingRecord = this.registeredHours.find((r) => r.date === today);
          if (existingRecord) {
            existingRecord.break += hoursBreak;
          } else {
            this.registeredHours.push({
              date: today,
              worked: 0,
              break: hoursBreak,
              overtime: 0,
            });
          }
          worker.breakStart = null;
        }

        try {
          await axios.put(`${url}worker/${worker.id}/status`, {status: newStatus});
          console.log("Estado actualizado correctamente.");

          // Recargar el gráfico y los datos
          await this.loadRegisteredHours(); // Recargar datos para actualizar el gráfico
        } catch (error) {
          console.error("Error al actualizar el estado:", error);
          worker.status = previousStatus; // Revertir en caso de error
        }
      }
    },
  },




  };
</script>

<template>
  <AppBar title="Panel de Control" style="position: fixed"/>
  <NavBar style="position: fixed"/>
  <div class="card-container">
    <Card class="ControlPanelCard">
      <text class="clock">Reloj de fichaje</text>
      <div class="clock-container">
        <i class="pi pi-clock"></i>
        <text class="time">{{ currentTime }}</text>
      </div>
      <div class="button-container">
        <button class="Iniciar" @click="changeWorkerStatus(userId, 1)">
          <i class="pi pi-play"></i> Iniciar
        </button>
        <button class="Descanso" @click="changeWorkerStatus(userId, 3)">
          <i class="pi pi-face-smile"></i> Descanso
        </button>
        <button class="Salir" @click="changeWorkerStatus(userId, 2)">
          <i class="pi pi-stop"></i> Salir
        </button>
      </div>

      <div class="separator-line"></div>
      <div class="laboral">
        <div class="laboraltext">
          <text class="clock">Hojas de horas</text>
        </div>
        <i class="pi pi-chevron-right" @click="schedulepagebutton"></i>
      </div>
    </Card>

    <Card class="ControlPanelCard status-indicator">
      <div class="status-card">
        <div
            class="status-indicator-circle"
            :class="{
        working: worker.status === 1,
        break: worker.status === 3,
        out: worker.status === 2
      }"
        ></div>
        <div class="status-text">
          <span v-if="worker.status === 1">Trabajando...</span>
          <span v-else-if="worker.status === 3">En Descanso...</span>
          <span v-else-if="worker.status === 2">Fuera de la Oficina</span>
        </div>
      </div>
    </Card>

    <Card class="ControlPanelCard">
      <text>Horas registradas</text>
      <div class="separator-line"></div>
      <div class="hours-worked-summary">
        <div class="hours-container">
          <text class="hours">{{ totalWorked }}h</text>
          <text class="label">TRABAJADO</text>
        </div>
        <div class="hours-container">
          <text class="hours">{{ totalBreak }}h</text>
          <text class="label">DESCANSOS</text>
        </div>
        <div class="hours-container">
          <text class="hours">{{ totalOvertime }}h</text>
          <text class="label">HORAS EXTRAS</text>
        </div>
      </div>

      <graph ref="graph" :labels="workedHoursByDay.labels" :data="workedHoursByDay.data"></graph>
    </Card>

    <!-- Botón de ayuda -->
    <button class="help-button" @click="showModal = true">?</button>

    <!-- Fondo sombreado -->
    <div v-if="showModal" class="modal-backdrop" @click="showModal = false"></div>

    <!-- Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2 class="modal-title">¿Cómo funciona?</h2>
        <p class="modal-description">
          Aprende a gestionar tu jornada laboral con estas simples acciones:
        </p>
        <ul class="modal-list">
          <li><b>Iniciar:</b> Comienza a registrar tus horas de trabajo.</li>
          <li><b>Descanso:</b> Pausa tus horas laborales para registrar un descanso.</li>
          <li><b>Reanudar:</b> Después del descanso, vuelve a darle a Iniciar para continuar.</li>
          <li><b>Salir:</b> Finaliza tu jornada laboral y guarda el registro.</li>
        </ul>
        <button class="close-button" @click="showModal = false">¡Entendido!</button>
      </div>
    </div>

  </div>
</template>


<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Fondo semitransparente */
  z-index: 999; /* Debajo del modal */
}
.modal {
  position: fixed;
  top: 30%; /* Aparece más arriba */
  left: 50%;
  transform: translate(-50%, -10%);
  width: 90%;
  max-width: 400px;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  text-align: center;
}

/* Contenido del modal */
.modal-content h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.modal-content p {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.modal-content ul {
  list-style-type: none;
  padding: 0;
}

.modal-content ul li {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

/* Botón para cerrar el modal */
.close-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.close-button:hover {
  background-color: #45a049;
}

.help-button {
  position: fixed;
  top: 83%;
  left: 2%; /* Cambiado de right a left */
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.help-button:hover {
  background-color: #0056b3;
}

.status-card {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0.2rem;

  border-radius: 8px;

  transition: background-color 0.3s ease;
}

/* Indicador circular */
.status-indicator-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 1rem;
  margin-left: 3rem;
  margin-up:1px;
  transition: all 0.3s ease-in-out;
}

/* Estados visuales */
.status-indicator-circle.working {
  background-color: #4caf50; /* Verde */
  animation: pulse 1.5s infinite;
}

.status-indicator-circle.break {
  background-color: #ffc107; /* Amarillo */
  animation: rotate 2s infinite linear;
}

.status-indicator-circle.out {
  background-color: #f44336; /* Rojo */
  animation: bounce 4s infinite;
}

/* Texto del estado */
.status-text {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

/* Animaciones */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);

  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(2px);
  }
  50% {
    transform: translateY(-3px);
  }
}
.hours-worked-summary {
  display: flex;
  justify-content: space-around;
  padding: 0.2rem;
}

.hours-summary {
  display: flex;
  justify-content: space-around;
}


.hours-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hours {
  font-size: 0.875rem; /* Reducir el tamaño de la fuente */
  font-weight: bold;
}

.label {
  font-size: 0.7rem; /* Reducir el tamaño de la fuente */
  color: #888;
}

.card-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* Reducir el espacio entre las tarjetas */
  justify-content: center;

  align-items: center;
  height: calc(100vh);
  padding: 0 0; /* Reducir el padding en los laterales */

}

/* Estilos de la tarjeta */
.ControlPanelCard {
  width: 90%;
  max-width: 350px; /* Reducir el ancho máximo */
  border-radius: 10px; /* Reducir el radio de borde */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* Ajustar la sombra */
  padding: 0.4rem; /* Reducir el padding interno */
  background-color: white;
  border: 1px solid #ccc; /* Reducir el borde */
}

.clock-container {
  display: flex;
  align-items: center;
  margin-bottom: 0.4rem; /* Reducir el margen inferior */
}

.time {
  font-size: 1.5rem; /* Reducir el tamaño de la hora */
}

.pi-clock {
  font-size: 1.5rem; /* Reducir el tamaño del ícono */
  margin-right: 0.3rem;
  color: #70d570;
}

.clock {
  font-size: 0.875rem; /* Reducir el tamaño del texto del reloj */
  font-weight: bold;
}

/* Contenedor de los botones */
.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
}

.button-container button {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 4px; /* Reducir separación entre botones */
  padding: 2px 0; /* Reducir padding */
  color: white;
  border: none;
  border-radius: 15px; /* Reducir el borde redondeado */
  cursor: pointer;
  font-size: 0.75rem; /* Reducir tamaño de fuente */
}

.button-container button i {
  margin-right: 5px; /* Reducir el espaciado entre ícono y texto */
  font-size: 0.7rem; /* Reducir el tamaño del ícono */
}

.Iniciar {
  background-color: #4CAF50;
}

.Descanso {
  background-color: #FFC107;
}

.Salir {
  background-color: red;
}

.separator-line {
  width: 100%;
  height: 0.5px;
  background-color: #ccc;
  margin: 2px 0; /* Reducir los márgenes */
}

/* Estilos de la sección laboral */
.laboral {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1px;
}

.laboraltext {
  display: flex;
  flex-direction: column;
}

.laboral .pi-chevron-right {
  font-size: 1.2rem; /* Reducir el tamaño del ícono */
}
</style>
