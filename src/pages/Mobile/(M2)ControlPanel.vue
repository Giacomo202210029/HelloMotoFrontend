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
      workers: [],
      registeredHours:[],
      counts: { Dentro: 0, Descanso: 0, Fuera: 0 }, // Conteos por estado
      startTime: null,
      workerId: 1, // ID del trabajador seleccionado
      workedHoursByDay: {},
    };
  },
  mounted() {
    this.updateTime();
    setInterval(this.updateTime, 1000);
    this.loadRegisteredHours();

    // Cargar datos iniciales desde la API
    axios.get("http://localhost:3000/api/v1/data").then(response => {
      this.workers = response.data;
      this.updateCounts();
      this.updateGraphData();
    }).catch(error => {
      console.error("Error al cargar trabajadores:", error);
    });
  },

  methods: {
    updateTime() {
      this.currentTime = getCurrentTime();
    },
    async loadRegisteredHours() {
      try {
        const response = await axios.get(
            `http://localhost:3000/api/v1/worker/${this.workerId}`
        );
        const worker = response.data;

        // Asignar las horas registradas del backend
        this.registeredHours = worker.registeredHours;

        // Transformar datos para el gráfico
        this.updateGraphData();
      } catch (error) {
        console.error("Error al cargar las horas registradas:", error);
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
      this.workedHoursByDay = { labels, data };

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

          // Si el backend devuelve los datos actualizados, los sincronizamos
          worker.registeredHours = response.data.worker.registeredHours;
          worker.startTime = response.data.worker.startTime;

          this.updateCounts(); // Actualizar conteos en el segundo card
          this.updateGraphData(); // Actualizar gráfico
        } catch (error) {
          console.error("Error en solicitud:", error);
          worker.status = previousStatus; // Revertir en caso de error
        }
      }
    },

    updateCounts() {
      this.counts = {
        Dentro: this.workers.filter(worker => worker.status === 1).length,
        Descanso: this.workers.filter(worker => worker.status === 3).length,
        Fuera: this.workers.filter(worker => worker.status === 2).length,
      };
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
      <div class="hours-summary">
        <div class="hours-container">
          <text class="hours">{{ counts.Dentro }}</text>
          <text class="label">DENTRO</text>
        </div>
        <div class="hours-container">
          <text class="hours">{{ counts.Descanso }}</text>
          <text class="label">DESCANSO</text>
        </div>
        <div class="hours-container">
          <text class="hours">{{ counts.Fuera }}</text>
          <text class="label">FUERA</text>
        </div>
      </div>

    </Card>
    <Card class="ControlPanelCard">
      <text>Horas registradas</text>
      <div class="separator-line"></div>
      <div class="hours-worked-summary">
        <div class="hours-container">
          <text class="hours">
            {{ }}
          </text>
          <text class="label">TRABAJADO</text>
        </div>
        <div class="hours-container">
          <text class="hours">
            {{ registeredHours?.reduce?.((sum, record) => sum + (Number(record.hours) || 0), 0).toFixed(2) }}
          </text>
          <text class="label">DESCANSOS</text>
        </div>
        <div class="hours-container">
          <text class="hours">
            {{ registeredHours?.reduce?.((sum, record) => sum + (Number(record.hours) || 0), 0).toFixed(2) }}
          </text>
          <text class="label">HORAS EXTRAS</text>
        </div>
      </div>
      <graph ref="graph" :labels="workedHoursByDay.labels" :data="workedHoursByDay.data"></graph>
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
