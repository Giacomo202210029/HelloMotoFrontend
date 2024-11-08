<script>
import AppBar from "../../components/ForMobile/AppBar.vue";
import NavBar from "../../components/ForMobile/NavBar.vue";
import { getCurrentTime } from "../../utils/time.js";
import axios from 'axios';
import Graph from "../../components/ForMobile/graph.vue";

export default {
  name: "ControlPanelMovil",
  components: { Graph, NavBar, AppBar },
  data() {
    return {
      currentTime: getCurrentTime(),
      workers: [
        { id: 1, name: "Juan Peterson", status: 2, totalWorkedHours: 0, totalBreakHours: 0, totalOvertimeHours: 0 },
        { id: 2, name: "Ana López", status: 2, totalWorkedHours: 0, totalBreakHours: 0, totalOvertimeHours: 0 },
        { id: 3, name: "Carlos Pérez", status: 2, totalWorkedHours: 0, totalBreakHours: 0, totalOvertimeHours: 0 },
      ],
      startTime: null,
      workedHoursByDay: {},
    };
  },
  mounted() {
    this.updateTime();
    setInterval(this.updateTime, 1000);
  },
  methods: {
    updateTime() {
      this.currentTime = getCurrentTime();
    },

    updateGraphData() {
      const workedHoursByDay = JSON.parse(JSON.stringify(this.workedHoursByDay));
      const labels = Object.keys(workedHoursByDay);
      const data = Object.values(workedHoursByDay);

      if (this.$refs.graph) {
        this.$refs.graph.updateChart(labels, data);
      }
    },

    async changeWorkerStatus(workerId, newStatus) {
      const worker = this.workers.find(w => w.id === workerId);
      if (worker) {
        const previousStatus = worker.status;
        worker.status = newStatus;

        try {
          const response = await axios.put(
              `http://localhost:3000/api/v1/worker/${worker.id}/status`,
              { status: newStatus }
          );
          console.log("Estado actualizado correctamente:", response.data.message);

          if (newStatus === 1) {
            worker.startTime = new Date();
          } else if (newStatus === 2 && worker.startTime) {
            const endTime = new Date();
            const hoursWorked = (endTime - worker.startTime) / (1000 * 60 * 60);
            worker.totalWorkedHours += hoursWorked;
            const today = new Date().toISOString().slice(0, 10);

            if (this.workedHoursByDay[today]) {
              this.workedHoursByDay[today] += hoursWorked;
            } else {
              this.workedHoursByDay[today] = hoursWorked;
            }

            this.updateGraphData();
            worker.startTime = null;
          } else if (newStatus === 3 && worker.startTime) {
            const endTime = new Date();
            const breakHours = (endTime - worker.startTime) / (1000 * 60 * 60);
            worker.totalBreakHours += breakHours;
          }
        } catch (error) {
          console.error("Error en solicitud:", error);
          worker.status = previousStatus; // Revertir en caso de error
        }
      }
    },

    countWorkersByStatus(status) {
      return this.workers.filter(worker => worker.status === status).length;
    }
  }
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
        <button class="Iniciar" @click="changeWorkerStatus(1, 1)">
          <i class="pi pi-play"></i> Iniciar
        </button>
        <button class="Descanso" @click="changeWorkerStatus(1, 3)">
          <i class="pi pi-face-smile"></i> Descanso
        </button>
        <button class="Salir" @click="changeWorkerStatus(1, 2)">
          <i class="pi pi-stop"></i> Salir
        </button>
      </div>
      <div class="separator-line"></div>
      <div class="laboral">
        <div class="laboraltext">
          <text class="clock">Hojas de horas</text>
          <text class="laboral">Horario Laboral</text>
        </div>
        <i class="pi pi-chevron-right"></i>
      </div>
    </Card>
    <Card class="ControlPanelCard">
      <text>¿Quién está dentro/fuera?</text>
      <div class="separator-line"></div>
      <div class="hours-summary">
        <div class="hours-container">
          <text class="hours">{{ countWorkersByStatus(1) }}</text>
          <text class="label">DENTRO</text>
        </div>
        <div class="hours-container">
          <text class="hours">{{ countWorkersByStatus(3) }}</text>
          <text class="label">DESCANSO</text>
        </div>
        <div class="hours-container">
          <text class="hours">{{ countWorkersByStatus(2) }}</text>
          <text class="label">FUERA</text>
        </div>
      </div>
    </Card>
    <Card class="ControlPanelCard">
      <text>Horas registradas</text>
      <div class="separator-line"></div>
      <div class="hours-worked-summary">
        <div class="hours-container">
          <text class="hours">{{ workers[0].totalWorkedHours.toFixed(2) }}h</text>
          <text class="label">TRABAJADO</text>
        </div>
        <div class="hours-container">
          <text class="hours">{{ workers[0].totalBreakHours.toFixed(2) }}h</text>
          <text class="label">DESCANSOS</text>
        </div>
        <div class="hours-container">
          <text class="hours">{{ workers[0].totalOvertimeHours.toFixed(2) }}h</text>
          <text class="label">HORAS EXTRAS</text>
        </div>
      </div>
      <graph ref="graph" :labels="Object.keys(workedHoursByDay)" :data="Object.values(workedHoursByDay)"></graph>
    </Card>
  </div>
</template>

<style scoped>
.hours-worked-summary {
  display: flex;
  justify-content: space-around;
  padding: 2rem;
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
  gap: 0.75rem; /* Reducir el espacio entre las tarjetas */
  justify-content: center;
  align-items: center;
  height: calc(100vh);
  padding: 0 0.75rem; /* Reducir el padding en los laterales */

}

/* Estilos de la tarjeta */
.ControlPanelCard {
  width: 100%;
  max-width: 350px; /* Reducir el ancho máximo */
  border-radius: 10px; /* Reducir el radio de borde */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* Ajustar la sombra */
  padding: 0.6rem; /* Reducir el padding interno */
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
  height: 1px;
  background-color: #ccc;
  margin: 8px 0; /* Reducir los márgenes */
}

/* Estilos de la sección laboral */
.laboral {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.laboraltext {
  display: flex;
  flex-direction: column;
}

.laboral .pi-chevron-right {
  font-size: 1.2rem; /* Reducir el tamaño del ícono */
}
</style>
