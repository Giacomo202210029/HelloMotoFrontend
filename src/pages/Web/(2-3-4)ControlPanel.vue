<script>
import MenuItem from "../../components/ForMenu/MenuItem.vue";
import MyMenu from "../../components/ForMenu/MyMenu.vue";
import getStatusesService from "../../services/get.statuses.service.js";
import getWorkersInStatusService from "../../services/get.workers.in.status.service.js";
import { daysPerMonth, daysBetween } from "../../utils/time.js";

export default {
  name: "ControlPanel",
  components: {
    MenuItem,
    MyMenu,
  },

  data() {
    return {
      isAnimating: 0,
      chartInstance: null,
      currentCategory: 'Day',
      searchQuery: '',
      currentStatus: 'Dentro',
      Statuses: {},
      peopleStatus: {
        Dentro: [],
        Descanso: [],
        Fuera: [],
      },
      chartData: {
        Day: {
          labels: ['Horas trabajadas'],
          datasets: [
            {
              label: 'Trabajo',
              data: 0,
              backgroundColor: '#36a2eb',
            },
            {
              label: 'Descanso',
              data: 0,
              backgroundColor: '#ff6384',
            },
            {
              label: 'Horas Extra',
              data: 0,
              backgroundColor: '#ffcd56',
            },
          ],
        },
        Week: {
          labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
          datasets: [
            {
              label: 'Trabajo',
              data: this.generateRandomData(7),
              backgroundColor: '#36a2eb',
            },
            {
              label: 'Descanso',
              data: this.generateRandomData(7),
              backgroundColor: '#ff6384',
            },
            {
              label: 'Horas Extra',
              data: this.generateRandomData(7),
              backgroundColor: '#ffcd56',
            },
          ],
        },
        Month: {
          labels: Array.from({ length: 30 }, (_, i) => `Día ${i + 1}`),
          datasets: [
            {
              label: 'Trabajo',
              data: this.generateRandomData(30),
              backgroundColor: '#36a2eb',
            },
            {
              label: 'Descanso',
              data: this.generateRandomData(30),
              backgroundColor: '#ff6384',
            },
            {
              label: 'Horas Extra',
              data: this.generateRandomData(30),
              backgroundColor: '#ffcd56',
            },
          ],
        },
      },
    };
  },

  computed: {
    filteredNames() {
      return this.peopleStatus[this.currentStatus].filter(worker =>
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
    setStatus(status) {
      this.currentStatus = status;
    },

    filterNames() {
      // This function is called when the user presses enter in the search bar
      // The filtering is already handled by the computed property
    },

    generateRandomData(count) {
      return Array.from({ length: count }, () => Math.floor(Math.random() * 8) + 1);
    },

    updateChart(category) {
      if (this.isAnimating === 1) return;
      this.currentCategory = category;
      this.isAnimating = 1;
      const ctx = document.getElementById('barChart');

      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      this.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: this.chartData[category],
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              suggestedMax: 10,
            },
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
          },
        },
      });
      this.allowChangingChartAfterOneSecond();
    },

    allowChangingChartAfterOneSecond() {
      // Espera de un segundo antes de restablecer isAnimating
      setTimeout(() => {
        this.isAnimating = 0;
      }, 1000); // 1000 ms = 1 segundo
    },

    watchWorkerRegistry(worker) {
      let lastReg = worker.registeredHours[worker.registeredHours.length - 1];

      this.chartData.Day.datasets = [];
      this.chartData.Day.labels = [`Horas trabajadas por ${worker.name}`];
      for (let status of this.Statuses) {
        this.chartData.Day.datasets.push({
          label: status.name,
          data: lastReg[status.name],
          backgroundColor: status.color,
        });
      }
      this.chartData.Week.datasets = [];
      for (let status of this.Statuses) {
        let myData = [];

        // Obtén los últimos 7 registros o menos si no hay suficientes
        let regsToAnalize = worker.registeredHours.slice(-7);

        for (let analizing in regsToAnalize) {
          if (analizing.weekday <= lastReg.weekday && daysBetween(analizing, lastReg) < 7) {
            while (analizing.weekday !== myData.length + 1) {
              myData.push(0);
            }
            myData.push(analizing);
          }
        }

        while (myData.length < 7) {
          myData.push(0);
        }

        this.chartData.Week.datasets.push({
          label: status.name,
          data: myData,
          backgroundColor: status.color,
        });
      }
      this.chartData.Month.datasets = [];
      for (let status of this.Statuses) {
        let myData = [];
        let filteredMonthly = worker.registeredHours.filter(reg => reg.month === lastReg.month && reg.year === lastReg.year);
        for (let day = 1; day < daysPerMonth(lastReg.month, lastReg.day); day++) {
          if (!filteredMonthly.length) {
            myData.push(0);
            return;
          }
          if (filteredMonthly[0].day === day) {
            myData.push(filteredMonthly.shift()[status]);
            return;
          }
          myData.push(0);
        }
        this.chartData.Month.datasets.push({
          label: status.name,
          data: myData,
          backgroundColor: status.color,
        });
      }
      this.updateChart(this.currentCategory);
    },
  },

  mounted() {
    this.updateChart('Day');
  },

  async created() {
    try {
      this.Statuses = await getStatusesService();
      this.peopleStatus = {};

      // Crear un array de promesas para obtener los trabajadores por estado
      const promises = this.Statuses.map(async (status) => {
        this.peopleStatus[status.name] = [];
        this.peopleStatus[status.name] = await getWorkersInStatusService(status.id);
      });

      // Esperar a que todas las promesas se completen
      await Promise.all(promises);
    } catch (error) {
      console.error("Error al cargar los estados o trabajadores:", error);
    }
  },
};
</script>

<template>
  <div class="chat-container">
    <MyMenu></MyMenu>

    <div class="dashboard">
      <div class="title-container">
        <h2 style="font-size: 3rem;">Panel de control</h2>
      </div>

      <div class="category-buttons">
        <button @click="updateChart('Day')" :class="{ active: currentCategory === 'Day' }" :disabled="isAnimating">Day</button>
        <button @click="updateChart('Week')" :class="{ active: currentCategory === 'Week' }" :disabled="isAnimating">Week</button>
        <button @click="updateChart('Month')" :class="{ active: currentCategory === 'Month' }" :disabled="isAnimating">Month</button>
      </div>

      <div class="section registered-hours">
        <h2>Registered Hours</h2>
        <canvas id="barChart"></canvas>
      </div>

      <div class="section localizations-container">
        <h2>Localizaciones</h2>
        <img :src="localizationImage" alt="Mapa de Localizaciones" class="localization-image" />
        <button @click="fetchLocalization">Actualizar Localizaciones</button>
      </div>
    </div>

    <div class="right-sidebar">
      <h2>Información Adicional</h2>

      <div class="category-buttons">
        <div v-for="status in Object.keys(statusCounts)">
          <button @click="setStatus(status)" :class="{ active: currentStatus === status }">
            {{ status }} ({{ statusCounts[status] }})
          </button>
        </div>
      </div>

      <div class="search-bar">
        <input type="text" v-model="searchQuery" @keyup.enter="filterNames" placeholder="Buscar persona..." />
      </div>

      <div class="names-list">
        <ul>
          <li v-for="(worker, index) in filteredNames" :key="index" style="margin-left: 1rem; margin-right: 1rem; cursor: pointer" @click="watchWorkerRegistry(worker)">
            {{ worker.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
