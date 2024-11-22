<script>
import MenuItem from "../../components/ForMenu/MenuItem.vue";
import MyMenu from "../../components/ForMenu/MyMenu.vue";
import axios from "axios";

export default {
  name: "ControlPanel",
  components: {
    MenuItem,
    MyMenu,
  },

  data() {
    return {
      selectedWorker: null, // Trabajador actualmente seleccionado
      isAnimating: 0,
      chartInstance: null,
      currentCategory: "Day",
      searchQuery: "",
      currentStatus: "Dentro",
      Statuses: [],
      peopleStatus: {
        Dentro: [],
        Descanso: [],
        Fuera: [],
      },
      chartData: {
        Day: {
          labels: ["Horas trabajadas"],
          datasets: [
            {
              label: "Trabajo",
              data: [5],
              backgroundColor: "#36a2eb",
            },
            {
              label: "Descanso",
              data: [3],
              backgroundColor: "#ff6384",
            },
            {
              label: "Horas Extra",
              data: [2],
              backgroundColor: "#ffcd56",
            },
          ],
        },
        Week: {
          labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
          datasets: [
            {
              label: "Trabajo",
              data: this.generateRandomData(7),
              backgroundColor: "#36a2eb",
            },
            {
              label: "Descanso",
              data: this.generateRandomData(7),
              backgroundColor: "#ff6384",
            },
            {
              label: "Horas Extra",
              data: this.generateRandomData(7),
              backgroundColor: "#ffcd56",
            },
          ],
        },
        Month: {
          labels: Array.from({ length: 30 }, (_, i) => `Día ${i + 1}`),
          datasets: [
            {
              label: "Trabajo",
              data: this.generateRandomData(30),
              backgroundColor: "#36a2eb",
            },
            {
              label: "Descanso",
              data: this.generateRandomData(30),
              backgroundColor: "#ff6384",
            },
            {
              label: "Horas Extra",
              data: this.generateRandomData(30),
              backgroundColor: "#ffcd56",
            },
          ],
        },
      },
    };
  },

  computed: {
    filteredNames() {
      return this.peopleStatus[this.currentStatus].filter((worker) =>
          worker.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },

    statusCounts() {
      return {
        Dentro: this.peopleStatus.Dentro.length,
        Descanso: this.peopleStatus.Descanso.length,
        Fuera: this.peopleStatus.Fuera.length,
      };
    },
  },

  methods: {
    async fetchStatuses() {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/statuses");
        this.Statuses = response.data;
      } catch (error) {
        console.error("Error al obtener los estados:", error);
      }
    },

    async fetchWorkers() {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/data");
        const workers = response.data;

        this.peopleStatus = {
          Dentro: workers.filter((worker) => worker.status === 1),
          Descanso: workers.filter((worker) => worker.status === 3),
          Fuera: workers.filter((worker) => worker.status === 2),
        };

        if (workers.length > 0) {
          this.watchWorkerRegistry(workers[0]); // Seleccionar el primer trabajador por defecto
        }
      } catch (error) {
        console.error("Error al obtener los trabajadores:", error);
      }
    },


    setStatus(status) {
      this.currentStatus = status;
    },

    generateRandomData(count) {
      return Array.from({ length: count }, () => Math.floor(Math.random() * 8) + 1);
    },

    updateChart(category) {
      if (this.isAnimating === 1) return;
      this.currentCategory = category;
      this.isAnimating = 1;

      const ctx = document.getElementById("barChart");

      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      this.chartInstance = new Chart(ctx, {
        type: "bar",
        data: this.chartData[category], // Usar los datos actualizados
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Días',
              },
              ticks: {
                autoSkip: true, // Omitir etiquetas si hay demasiadas
                maxTicksLimit: 10, // Limitar a 10 etiquetas visibles
                maxRotation: 0,
                minRotation: 0,
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Horas',
              },
              ticks: {
                stepSize: 1, // Asegurar incrementos claros
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
          },
        },
      });

      this.allowChangingChartAfterOneSecond();
    },


    allowChangingChartAfterOneSecond() {
      setTimeout(() => {
        this.isAnimating = 0;
      }, 1000); // 1000 ms = 1 segundo
    },

    watchWorkerRegistry(worker) {
      console.log(`Mostrando datos del trabajador: ${worker.name}`);
      this.selectedWorker = worker; // Guardar el trabajador seleccionado

      // Actualizar el gráfico con los datos del trabajador seleccionado
      const labels = worker.registeredHours.map((record) => record.date);
      const data = worker.registeredHours.map((record) => record.worked || 0);

      this.chartData.Day.labels = labels;
      this.chartData.Day.datasets[0].data = data;

      // Actualiza el gráfico
      this.updateChart("Day");
    },

  },

  async mounted() {
    await this.fetchStatuses();
    await this.fetchWorkers();
    this.updateChart("Day");
  },
};
</script>

<template>
  <div class="chat-container">
    <MyMenu />

    <div class="dashboard">
      <div class="title-container">
        <h2>Panel de control</h2>
      </div>

      <div class="category-buttons">
        <button
            @click="updateChart('Day')"
            :class="{ active: currentCategory === 'Day' }"
            :disabled="isAnimating"
        >
          Day
        </button>
        <button
            @click="updateChart('Week')"
            :class="{ active: currentCategory === 'Week' }"
            :disabled="isAnimating"
        >
          Week
        </button>
        <button
            @click="updateChart('Month')"
            :class="{ active: currentCategory === 'Month' }"
            :disabled="isAnimating"
        >
          Month
        </button>
      </div>

      <div class="section registered-hours">
        <h2>Registered Hours</h2>
        <canvas id="barChart" class="barChart"></canvas>
      </div>
    </div>

    <div class="right-sidebar">
      <h2>Información Adicional</h2>

      <div class="category-buttons">
        <button
            v-for="status in Object.keys(statusCounts)"
            :key="status"
            @click="setStatus(status)"
            :class="{ active: currentStatus === status }"
        >
          {{ status }} ({{ statusCounts[status] }})
        </button>
      </div>

      <div class="search-bar">
        <input
            type="text"
            v-model="searchQuery"
            @keyup.enter="filterNames"
            placeholder="Buscar persona..."
        />
      </div>

      <div class="names-list">
        <ul>
          <li
              v-for="(worker, index) in filteredNames"
              :key="index"
              :class="{ active: worker === selectedWorker }"
              @click="watchWorkerRegistry(worker)"
          >
            {{ worker.name }}
          </li>
        </ul>

      </div>
    </div>
  </div>
</template>

<style scoped>
.barChart{
  max-width: 100%;
  max-height: 200px;
}

.names-list li.active {
  background-color: #0071dc;
  color: white;
}

.chat-container {
  display: flex;
  height: 100vh;
}

.dashboard {
  flex-grow: 1;
  padding: 20px;
}

.category-buttons button {
  padding: 10px 20px;
  border-radius: 5px;
}

.right-sidebar {
  width: 25%;
}
/* Estilos generales */
body, input, button, h1, h2, ul, li, span {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #ffffff;
}

.chat-container {
  display: flex;
  height: 100vh;
}

.dashboard {
  padding: 20px;
  margin-left: 280px;
  flex-grow: 1;
}

/* Botones de estado */
.category-buttons {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

.category-buttons button {
  padding: 10px 20px;
  background-color: transparent;
  border: 2px solid #0071dc;
  color: #0071dc;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: border-color 0.3s ease, color 0.3s ease, background-color 0.3s ease;
}

.category-buttons button:hover {
  border-color: #0056b3;
  color: #0056b3;
}

.category-buttons button.active {
  border-color: #0056b3;
  color: white;
  background-color: #0056b3;
}

/* Otras secciones */
.section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.right-sidebar {
  width: 20%;
  padding: 10px;
  background-color: #ffffff;
  border-left: 1px solid #e0e0e0;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

/* Otros estilos para barra de búsqueda, lista de nombres, etc. */
.search-bar {
  margin: 20px 0;
}

.search-bar input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.names-list ul {
  list-style: none;
  padding: 0;
}

.names-list li {
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
}
</style>
