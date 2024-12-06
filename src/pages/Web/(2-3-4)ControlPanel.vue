<script>
import MenuItem from "../../components/ForMenu/MenuItem.vue";
import MyMenu from "../../components/ForMenu/MyMenu.vue";
import axios from "axios";
import {Chart} from "chart.js";

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
              dataday: [5], //Cambio de llamada al dataday
              backgroundColor: "#36a2eb",
            },
            {
              label: "Descanso",
              dataday: [3], //Cambio de llamada al dataday
              backgroundColor: "#ff6384",
            },
            {
              label: "Horas Extra",
              dataday: [2], //Cambio de llamada al dataday
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
          labels: Array.from({ length: 30 }, (_, i) => `Día ${i}`),
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
    async fetchWorkersDay() { //Fetch de workers para solo el primer registro recibido, usado en DIAS
      try {
        const response = await axios.get("http://localhost:3000/api/v1/data");
        const workers = response.dataday;

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
      return Array.from({length: count}, () => Math.floor(Math.random() * 8) + 1);
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
      this.selectedWorker = worker;

      // Inicializar datos y etiquetas
      const labels = [];
      const workedData = [];
      const breakData = [];
      const overtimeData = [];
      const uniqueLabels = new Set();
      const today = new Date(); // Fecha actual
      const formattedToday = today.toISOString().slice(0, 10); // 'YYYY-MM-DD' formato

      // Filtrar el registro de horas solo para la fecha actual
      worker.registeredHours.forEach(record => {
        const date = new Date(record.date); // Convertir la fecha a objeto Date
        const formattedDate = date.toISOString().slice(0, 10); // 'YYYY-MM-DD' formato

        // Solo agregar si el registro coincide con el día actual
        if (formattedDate === formattedToday) {
          labels.push(formattedDate); // Agregar la fecha como etiqueta
          workedData.push(record.worked || 0); // Agregar las horas trabajadas
          breakData.push(record.break || 0); // Agregar las horas de descanso
          overtimeData.push(record.overtime || 0); // Agregar las horas extra
        }
      });

      // Si no se encuentran registros para el día actual, establecer valores por defecto
      if (labels.length === 0) {
        labels.push(formattedToday); // Mostrar la fecha de hoy aunque no haya registros
        workedData.push(0); // Si no hay horas, se establece en 0
        breakData.push(0); // Si no hay horas de descanso, se establece en 0
        overtimeData.push(0); // Si no hay horas extras, se establece en 0
      }

      // Asignar los datos del gráfico de "Day"
      this.chartData.Day.labels = labels;
      this.chartData.Day.datasets[0].data = workedData;
      this.chartData.Day.datasets[1].data = breakData;
      this.chartData.Day.datasets[2].data = overtimeData;

      // Actualizar el gráfico
      this.updateChart("Day");

      // Inicializar datos y etiquetas para el gráfico semanal
      const daysOfWeek = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
      const weeklyWorked = Array(7).fill(0); // Array de 7 días para horas trabajadas
      const weeklyBreak = Array(7).fill(0); // Array de 7 días para horas de descanso
      const weeklyOvertime = Array(7).fill(0); // Array de 7 días para horas extra

      const uniqueDates = new Set(); // Para evitar sumar fechas duplicadas

      // Encontrar la última fecha registrada
      let lastDate = new Date(Math.max(...worker.registeredHours.map(record => new Date(record.date).getTime())));

      // Calcular la semana de la última fecha registrada
      const lastWeekStartDate = this.getStartOfWeek(lastDate);

      // Iterar sobre los registros del trabajador seleccionado
      worker.registeredHours.forEach(record => {
        const date = new Date(record.date); // Convertir la fecha a objeto Date
        const dayOfWeek = date.getUTCDay(); // Obtener el día de la semana (0 = Domingo)

        // Corregir la asignación del día de la semana (0 = Domingo, pero lo queremos lunes como 0)
        const correctedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Ajuste: Domingo pasa a 6, Lunes sigue siendo 0

        // Si la fecha registrada está dentro de la misma semana que la última fecha, procesarla
        if (this.isSameWeek(lastWeekStartDate, date)) {
          weeklyWorked[correctedDayOfWeek] += record.worked || 0;
          weeklyBreak[correctedDayOfWeek] += record.break || 0;
          weeklyOvertime[correctedDayOfWeek] += record.overtime || 0;
        }
      });

      // Actualizar las etiquetas y los datos del gráfico semanal
      this.chartData.Week.labels = daysOfWeek;
      this.chartData.Week.datasets[0].data = weeklyWorked; // Trabajo
      this.chartData.Week.datasets[1].data = weeklyBreak; // Descanso
      this.chartData.Week.datasets[2].data = weeklyOvertime; // Horas extra
      this.updateChart("Week");

      // Inicializar datos y etiquetas para el gráfico mensual
      const daysInMonth = 31; // Usamos 31 días para el mes (aunque algunos meses tienen menos días)
      const dailyWorked = Array(daysInMonth).fill(0);
      const dailyBreak = Array(daysInMonth).fill(0);
      const dailyOvertime = Array(daysInMonth).fill(0);


      // Asegurar que la fecha esté bien ajustada
      lastDate.setHours(0, 0, 0, 0);  // Reseteamos la hora para trabajar solo con la fecha

      // Calcular el mes de la última fecha registrada
      const lastMonth = lastDate.getMonth(); // El mes de la última fecha registrada (0 = Enero, 11 = Diciembre)

      // Mostrar el mes del último día registrado (por ejemplo, Noviembre si el último dato es de Noviembre)
      console.log(`Mes actual: ${lastMonth + 1}`);

      // Iterar sobre los registros del trabajador seleccionado
      worker.registeredHours.forEach(record => {
        const date = new Date(record.date); // Convertir la fecha a objeto Date
        const day = date.getDate()+1; // Obtener el día del mes (1-31)
        const month = date.getMonth(); // Obtener el mes de la fecha

        // Filtrar solo los registros que pertenecen al mes actual
        if (month === lastMonth) {
          dailyWorked[day - 1] += record.worked || 0;
          dailyBreak[day - 1] += record.break || 0;
          dailyOvertime[day - 1] += record.overtime || 0;
        }
      });

      // Actualizar las etiquetas del gráfico mensual y asignar los datos
      this.chartData.Month.labels = Array.from({ length: daysInMonth }, (_, i) => `Día ${i + 1}`);
      this.chartData.Month.datasets[0].data = dailyWorked; // Trabajo
      this.chartData.Month.datasets[1].data = dailyBreak; // Descanso
      this.chartData.Month.datasets[2].data = dailyOvertime; // Horas extra
      this.updateChart("Month");
    },

// Función para obtener el inicio de la semana (lunes)
    getStartOfWeek(date) {
      const startDate = new Date(date);
      const day = startDate.getDay(),
          diff = startDate.getDate() - day + (day == 0 ? -6 : 1); // Asegura que el lunes sea el primer día de la semana
      startDate.setDate(diff);
      startDate.setHours(0, 0, 0, 0);
      return startDate;
    },

// Función para verificar si dos fechas están en la misma semana
    isSameWeek(date1, date2) {
      const startOfWeek1 = this.getStartOfWeek(date1);
      const startOfWeek2 = this.getStartOfWeek(date2);
      return startOfWeek1.getTime() === startOfWeek2.getTime();
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



.category-buttons button {
  padding: 10px 16px !important;
  border-radius: 5px;
}

.right-sidebar {
  width: 20%;
  margin-right:10px;
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
  margin-left: 250px;
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
