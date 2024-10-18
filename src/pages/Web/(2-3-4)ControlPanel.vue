<script>
import MenuItem from "../../components/ForMenu/MenuItem.vue";
import MyMenu from "../../components/ForMenu/MyMenu.vue";
import getStatusesService from "../../services/get.statuses.service.js";
import getWorkersInStatusService from "../../services/get.workers.in.status.service.js";
import {daysPerMonth, daysBetween} from "../../utils/time.js";
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
      Statuses: {

      },
      peopleStatus: {
        Dentro: [],
        Descanso: [],
        Fuera: []
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
      this.allowChangingChartAfterOneSecond()
    },
    allowChangingChartAfterOneSecond(){
      // Espera de un segundo antes de restablecer isAnimating
      setTimeout(() => {
        this.isAnimating = 0;
      }, 1000); // 1000 ms = 1 segundo
    },
    watchWorkerRegistry(worker){
      let lastReg = worker.registeredHours[worker.registeredHours.length - 1]

      this.chartData.Day.datasets = []
      this.chartData.Day.labels = [`Horas trabajadas por ${worker.name}`]
      for (let status of this.Statuses){
        this.chartData.Day.datasets.push({
          label: status.name,
          data: lastReg[status.name],
          backgroundColor:status.color,
        })
      }
      this.chartData.Week.datasets = []
      for (let status of this.Statuses) {
        let myData = [];

        // Obtén los últimos 7 registros o menos si no hay suficientes
        let regsToAnalize = worker.registeredHours.slice(-7);

        // Recorre desde el primer registro hasta el último en hoursToAnalyze
        for (let analizing in regsToAnalize) {
          // Verifica si el día de la semana del registro es menor que el último día registrado
          // y si la diferencia en días es menor a 7
          if (analizing.weekday <= lastReg.weekday && daysBetween(analizing, lastReg) < 7) {
            while(analizing.weekday !== myData.length + 1){
              myData.push(0);
            }
            myData.push(analizing);
          }
        }

        // Completa con 0s si hay menos de 7 elementos en myData
        while (myData.length < 7) {
          myData.push(0);
        }

        this.chartData.Week.datasets.push({
          label: status.name,
          data: myData,
          backgroundColor: status.color,
        });
      }
      this.chartData.Month.datasets = []
      for (let status of this.Statuses){
        let myData = []
        let filteredMonthly = worker.registeredHours.filter(reg => reg.month === lastReg.month && reg.year === lastReg.year)
        for(let day = 1; day < daysPerMonth(lastReg.month, lastReg.day); day++){
          if(!filteredMonthly.length) {
            myData.push(0); return;
          }
          if(filteredMonthly[0].day === day){
            myData.push(filteredMonthly.shift()[status]);
            return;
          }
          myData.push(0);
        }
        this.chartData.Month.datasets.push({
          label: status.name,
          data: myData,
          backgroundColor:status.color,
        })
      }
      this.updateChart(this.currentCategory)
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

    <!-- Contenido del dashboard -->
    <div class="dashboard">
      <h1>Control Panel</h1>

      <!-- Botones de selección de categoría en una fila sin tarjeta -->
      <div class="category-buttons">
        <button @click="updateChart('Day')" :class="{ active: currentCategory === 'Day' }" :disabled="isAnimating">Day</button>
        <button @click="updateChart('Week')" :class="{ active: currentCategory === 'Week' }" :disabled="isAnimating">Week</button>
        <button @click="updateChart('Month')" :class="{ active: currentCategory === 'Month' }" :disabled="isAnimating">Month</button>
      </div>

      <!-- Sección de gráficos -->
      <div class="section registered-hours">
        <h2>Registered Hours</h2>
        <canvas id="barChart"></canvas>
      </div>

      <!-- Sección de Localizaciones -->
      <div class="section localizations-container">
        <h2>Localizaciones</h2>
        <img :src="localizationImage" alt="Mapa de Localizaciones" class="localization-image" />
        <button @click="fetchLocalization">Actualizar Localizaciones</button>
      </div>
    </div>

    <!-- Sección a la derecha -->
    <div class="right-sidebar">
      <h2>Información Adicional</h2>

      <!-- Botones para cambiar estados con el mismo estilo -->
      <div class="category-buttons">
        <div  v-for="status in Object.keys(statusCounts)">
          <button @click="setStatus(status)" :class="{ active: currentStatus === status }">
            {{status}} ({{ statusCounts[status] }})
          </button>
        </div>
      </div>

      <!-- Barra de búsqueda para filtrar nombres -->
      <div class="search-bar">
        <input
            type="text"
            v-model="searchQuery"
            @keyup.enter="filterNames"
            placeholder="Buscar persona..."
        />
      </div>

      <!-- Lista que muestra los nombres filtrados -->
      <div class="names-list">
        <ul>
          <li v-for="(worker, index) in filteredNames" :key="index"
              style="margin-left: 1rem; margin-right: 1rem; cursor: pointer"
              @click="watchWorkerRegistry(worker)">
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
  background-color: #f0f0f0;
}

.chat-container {
  display: flex;
  height: 100vh;
}

.layout-menu {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 250px;
  background-color: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.logo {
  max-width: 150px;
  height: auto;
}

.user-account {
  margin-top: auto;
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  background-color: #f9f9f9;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dashboard {
  padding: 20px;
  margin-left: 280px; /* Cambié de 250px a 280px para darle más espacio a la derecha */
  flex-grow: 1;
}

/* Secciones */
.section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Botones del selector de categoría y botones adicionales de la sección derecha */
.category-buttons {
  margin: 20px 0;
}

.category-buttons button {
  margin-right: 10px;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.category-buttons button:hover {
  background-color: #0056b3;
}

.category-buttons button.active {
  background-color: #0056b3;
}

.image-container {
  margin-bottom: 30px;
}

.registered-image {
  max-width: 100%;
  height: auto;
}

.localizations-container {
  margin-top: 30px;
}

.localization-image {
  max-width: 100%;
  height: auto;
}

/* Barra de búsqueda */
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

/* Lista de nombres */
.names-list {
  margin-top: 20px;
}

.names-list ul {
  list-style: none;
  padding: 0;
}

.names-list li {
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
}

/* Sección derecha */
.right-sidebar {
  width: 20%;
  padding: 10px;
  background-color: #ffffff;
  border-left: 1px solid #e0e0e0;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}
.registered-hours {
  width: 90%; /* Ajusta el ancho */
  height: 60%; /* Ajusta la altura */
  padding: 20px; /* Ajusta el padding */
}
</style>
