<script>
import MyMenu from "../../components/ForMenu/MyMenu.vue";
import {Chart, registerables} from "chart.js";
import {jsPDF} from "jspdf";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import axios from 'axios';
import url from "../../services/url.service.js";

Chart.register(...registerables);

export default {
  name: "Informes",
  components: { MyMenu },
  data() {
    return {
      searchTerm: "",
      selectedUser: null,
      users: [], // Ahora la lista de usuarios estará vacía inicialmente.
      store: {},
      chart: null,
      currentCategory: "Week",
      currentMonthName: "N/A",
      chartData: {
        Month: {
          labels: Array.from({ length: 30 }, (_, i) => `Día ${i}`),
          datasets: [
            {
              label: "Horas Trabajadas",
              data: Array(30).fill(0), // Datos iniciales
              backgroundColor: "rgba(76, 175, 80, 0.5)",
            },
            {
              label: "Descansos",
              data: Array(30).fill(0),
              backgroundColor: "rgba(255, 165, 0, 0.5)",
            },
            {
              label: "Horas Extras",
              data: Array(30).fill(0),
              backgroundColor: "rgba(255, 0, 0, 0.5)",
            },
          ],
        },
      },
    };
  },
  computed: {
    filteredUsers() {
      if(this.searchTerm){
        const term = this.searchTerm.toLowerCase();
        return this.users.filter(
            (user) =>
                user.name.toLowerCase().includes(term) ||
                user.areaName.toLowerCase().includes(term)
        );
      }
      return this.users;

    },
    activeChartData() {
      return this.selectedUser
          ? this.store[this.selectedUser.name]?.chartData || []
          : [24, 24, 24, 24, 12, 0, 0]; // Datos generales si no hay usuario seleccionado
    },
    activeChartData2() {
      return this.selectedUser
          ? this.store[this.selectedUser.name]?.chartData2 || []
          : [0, 0, 0, 0, 1, 0, 0]; // Datos generales si no hay usuario seleccionado
    },
    activeChartData3() {
      return this.selectedUser
          ? this.store[this.selectedUser.name]?.chartData3 || []
          : [0, 0, 0, 0, 0, 0, 0]; // Horas extras generales si no hay usuario seleccionado
    },

    activeSchedule() {
      return this.selectedUser
          ? this.store[this.selectedUser.name]?.schedule || []
          : [
            "8:00 am - 5:00 pm  virtual",
            "8:00 am - 5:00 pm  virtual",
            "8:00 am - 5:00 pm  virtual",
            "8:00 am - 5:00 pm  virtual",
            "9:00 am - 12:30 pm  virtual",
            "Descanso",
            "Descanso",
          ];
    },
  },
  mounted() {
    this.fetchWorkers(); // Llamamos a fetchWorkers cuando se monta el componente.
    this.createChart(); // Inicializar el gráfico cuando se monta el componente
    console.log("Trabajadores:", this.users);
  },
  methods: {
    async fetchWorkerData(workerId) {
      try {
        const response = await axios.get(`${url}worker/${workerId}`);
        const worker = response.data;

        if (!worker.registeredHours || worker.registeredHours.length === 0) {
          console.error("No hay datos registrados para este trabajador.");
          return;
        }

        // Inicializar datos
        const daysInMonth = 31;
        const dailyWorked = Array(daysInMonth).fill(0);
        const dailyBreak = Array(daysInMonth).fill(0);
        const dailyOvertime = Array(daysInMonth).fill(0);

        const lastDate = new Date(Math.max(...worker.registeredHours.map(record => new Date(record.date).getTime())));
        //lastDate.setHours(0, 0, 0, 0);
        const lastMonth = lastDate.getMonth();
        const monthNames = [
          "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
          "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
        ];
        this.currentMonthName = monthNames[lastMonth];

        worker.registeredHours.forEach(record => {
          const date = new Date(record.date);
          const day = date.getDate();
          const month = date.getMonth();

          if (month === lastMonth) {
            dailyWorked[day] += record.worked || 0;
            dailyBreak[day] += record.break || 0;
            dailyOvertime[day] += record.overtime || 0;
          }
        });

        // Actualizar datos del gráfico
        this.chartData.Month.labels = Array.from({ length: daysInMonth }, (_, i) => `Día ${i+1}`);
        this.chartData.Month.datasets[0].data = dailyWorked;
        this.chartData.Month.datasets[1].data = dailyBreak;
        this.chartData.Month.datasets[2].data = dailyOvertime;

        this.updateChart("Month");
      } catch (error) {
        console.error("Error al obtener los datos del trabajador:", error);
      }
    },

    // Método para seleccionar un usuario
    selectUser(user) {
      this.selectedUser = user;

      if (user && user.id) {
        this.fetchWorkerData(user.id);
      } else {
        console.log("No hay usuario seleccionado.");
      }
    },
    async fetchWorkers() {
      try {
        const response = await axios.get(`${url}data`);
        let workers = response.data;

        // Procesar cada trabajador para obtener los nombres de sus áreas
        workers = await Promise.all(
            workers.map(async (worker) => {
              try {
                let areaNames = [];

                // Si el área es un arreglo, iterar sobre cada ID
                if (Array.isArray(worker.area)) {
                  const areaRequests = worker.area.map(async (areaId) => {
                    try {
                      const areaResponse = await axios.get(`${url}area/name/${areaId}`);
                      return areaResponse.data.name; // Retorna el nombre del área
                    } catch (error) {
                      console.error(`Error al obtener el nombre del área para ID ${areaId}:`, error);
                      return null; // Retorna null si falla
                    }
                  });

                  // Esperar a que todas las solicitudes se completen y filtrar valores nulos
                  const resolvedAreas = await Promise.all(areaRequests);
                  areaNames = resolvedAreas.filter((name) => name !== null);
                } else {
                  // Si no es un arreglo, intentar obtener el nombre directamente
                  const areaResponse = await axios.get(`${url}area/name/${worker.area}`);
                  areaNames = [areaResponse.data.name];
                }

                return { ...worker, areaNames: areaNames.join(", ") || "Área desconocida" };
              } catch (error) {
                console.error(`Error procesando las áreas del trabajador ${worker.id}:`, error);
                return { ...worker, areaNames: "Área desconocida" };
              }
            })
        );

        console.log(workers);

        // Reemplazamos users con la información extraída de los trabajadores
        this.users = workers.map((worker) => ({
          name: worker.name,
          areaName: worker.areaNames, // Ahora será una cadena con nombres concatenados
          schedule: worker.schedule,
          id: worker.id,
        }));

        if (workers.length > 0) {
          this.selectUser(workers[0]); // Seleccionar el primer usuario por defecto
        }
      } catch (error) {
        console.error("Error al obtener los trabajadores:", error);
      }
    },


    // Método para crear el gráfico
    createChart() {
      const ctx = this.$refs.hoursChart.getContext("2d");
      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(ctx, {
        type: "bar",
        data: this.chartData[this.currentCategory], // Usar datos basados en la categoría seleccionada
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },

    // Método para cambiar la categoría del gráfico
    updateChart(category) {
      this.currentCategory = category; // Cambiar la categoría actual
      this.createChart(); // Actualizar el gráfico con la nueva categoría
    },




    // Método para descargar el PDF
    downloadPDF() {
      const doc = new jsPDF();
      const userName = this.selectedUser ? this.selectedUser.name : "Usuario Desconocido";

      doc.setFontSize(18);
      doc.text(`Reporte de Horario - ${userName}`, 20, 20);

      html2canvas(this.$refs.hoursChart).then((canvas) => {
        doc.addImage(canvas.toDataURL("image/png"), "PNG", 20, 30, 180, 100);

        const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

        // Mapeo de días en español a claves en inglés
        const dayMapping = {
          "Lunes": "mon",
          "Martes": "tue",
          "Miércoles": "wed",
          "Jueves": "thu",
          "Viernes": "fri",
          "Sábado": "sat",
          "Domingo": "sun"
        };

        // Mapeo del horario de acuerdo a los días
        const scheduleTable = days.map((day) => {
          const dayKey = dayMapping[day]; // Mapea el día en español a su clave en inglés
          const scheduleForDay = this.selectedUser && this.selectedUser.schedule[dayKey]; // Accede a la propiedad correcta de schedule

          // Si existe horario, lo mostramos; si no, ponemos "N/A"
          const schedule = scheduleForDay && scheduleForDay.start ? `${scheduleForDay.start} - ${scheduleForDay.end} (${scheduleForDay.mode})` : "N/A";

          return [day, schedule]; // Devuelve el par [Día, Horario]
        });

        console.log("Schedule Table (before generating PDF):", scheduleTable);


        doc.setFontSize(12);
        doc.text("Horario:", 20, 140);
        doc.autoTable({
          startY: 150,
          head: [["Día", "Horario"]],
          body: scheduleTable,
          styles: {
            cellPadding: 3,
            fontSize: 10,
            halign: "center",
          },
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: [255, 255, 255],
          },
        });

        doc.save(`informe_${userName}.pdf`);
      });
    },
  },
};
</script>


<template>
  <div class="container">
    <MyMenu class="MyMenu"></MyMenu>
    <div class="content-container">
      <div class="user-panel">
        <!-- User Panel -->
        <div class="search-container">
          <i class="pi pi-search search-icon"></i>
          <input
              type="text"
              id="searchInput"
              placeholder="Buscar..."
              v-model="searchTerm"
          />
        </div>
        <div class="user-list">
          <div
              v-for="user in filteredUsers"
              :key="user.name"
              class="user-item"
          >
            <button
                class="user-button"
                @click="selectUser(user)"
                :class="{ selected: selectedUser === user }"
            >
              <div class="circle">
                <i class="pi pi-user user-icon"></i>
              </div>
              <div class="user-info">
                <p>{{ user.name }}</p>
                <p>{{ user.areaName }}</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div class="main-content" style="background-color: #ebeced;">
        <h2 class="title">
          Visualiza un resumen mensual de los trabajadores
          <button class="icon-button" @click="downloadPDF">
            <i class="pi pi-download icon-style"></i>
          </button>
        </h2>

        <!-- Botones para cambiar la vista del gráfico -->
        <!-- Botones para cambiar la vista del gráfico -->


        <!-- Gráfico -->
        <div class="card">
          <h2 class="mes">{{ currentMonthName }}</h2>

          <canvas id="hoursChart" ref="hoursChart"></canvas>
        </div>
        <div class="card horario-card">
          <h2 class="small-title">HORARIO</h2>
          <table class="horario-table">
            <thead>
            <tr>
              <th>L</th>
              <th>M</th>
              <th>M</th>
              <th>J</th>
              <th>V</th>
              <th>S</th>
              <th>D</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="selectedUser">
              <td class="Horario">
                {{ selectedUser.schedule?.mon?.start || 'N/A' }}<br/>
                {{ selectedUser.schedule?.mon?.end || 'N/A' }}<br/>
                {{ selectedUser.schedule?.mon?.mode || 'N/A' }}
              </td>
              <td class="Horario">
                {{ selectedUser.schedule?.tue?.start || 'N/A' }}<br/>
                {{ selectedUser.schedule?.tue?.end || 'N/A' }}<br/>
                {{ selectedUser.schedule?.tue?.mode || 'N/A' }}
              </td>
              <td class="Horario">
                {{ selectedUser.schedule?.wed?.start || 'N/A' }}<br/>
                {{ selectedUser.schedule?.wed?.end || 'N/A' }}<br/>
                {{ selectedUser.schedule?.wed?.mode || 'N/A' }}
              </td>
              <td class="Horario">
                {{ selectedUser.schedule?.thu?.start || 'N/A' }}<br/>
                {{ selectedUser.schedule?.thu?.end || 'N/A' }}<br/>
                {{ selectedUser.schedule?.thu?.mode || 'N/A' }}
              </td>
              <td class="Horario">
                {{ selectedUser.schedule?.fri?.start || 'N/A' }}<br/>
                {{ selectedUser.schedule?.fri?.end || 'N/A' }}<br/>
                {{ selectedUser.schedule?.fri?.mode || 'N/A' }}
              </td>
              <td class="Horario">
                {{ selectedUser.schedule?.sat?.start || 'N/A' }}<br/>
                {{ selectedUser.schedule?.sat?.end || 'N/A' }}<br/>
                {{ selectedUser.schedule?.sat?.mode || 'N/A' }}
              </td>
              <td class="Horario">
                {{ selectedUser.schedule?.sun?.start || 'N/A' }}<br/>
                {{ selectedUser.schedule?.sun?.end || 'N/A' }}<br/>
                {{ selectedUser.schedule?.sun?.mode || 'N/A' }}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.mes{
  display: flex;
  justify-content:center;
}
/* Botón de usuario */
.user-button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  width: 300px;
  border: 1px solid black;
  background: none;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.3s; /* Suaviza el cambio de color */
}

.user-button:hover {
  background-color: #f0f0f0; /* Color al pasar el cursor */
}

.user-button.selected {
  background-color: #a8c2e6; /* Color cuando está seleccionado */
}

/* Contenedor general  */
.container {
  display: flex;
  height: 100vh;
}

/* Menú lateral */
.MyMenu {
  width: 250px;
  background-color: #ffffff;
  border-right: 1px solid #d3d3d3;
  box-shadow: 2px 0 5px rgba(37, 36, 36, 0.1);
}

/* Contenedor principal */
.content-container {
  display: flex;
  flex-grow: 1;
  padding-left: 250px;
  overflow: hidden;
}

/* Panel de usuarios */
.user-panel {
  width: 18rem;
  background-color: #ebeced;
  padding: 25px;
  box-shadow: 2px 0 5px rgba(31, 30, 30, 0.1);
  border: 1px solid #87888a;
}

/* Búsqueda */
.search-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  position: relative;
  padding: 10px;
  border: 1px solid #87888a;
}

.search-icon {
  font-size: 18px;
  color: #000000;
}

#searchInput::placeholder {
  color: #000000;
}

/* Lista de usuarios */
.user-list {
  margin-top: 20px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 1px;
  margin-bottom: 10px;
}

.circle {
  width: 40px;
  height: 40px;
  border: 2px solid #424242;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-icon {
  font-size: 20px;
  color: #424242;
}

.user-info p {
  margin: 0;
}

.user-info p:first-child {
  font-weight: bold;
}

.user-info p:last-child {
  color: #666;
}

/* Contenido principal */
.main-content {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
}

.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.5rem;
  color: #666;
  margin-bottom: 20px;
}

.title .icon-button {
  position: relative;
  right: 0;
}

/* Tarjetas */
.card {
  padding: 20px;
  background-color: #fff;
  border: 1px solid #d3d3d3;
  border-radius: 8px;
  margin-bottom: 20px;
}

.horario-card {
  padding: 20px;
}

.horario-table {
  width: 100%;
  border-collapse: collapse;
}

.horario-table th,
.horario-table td {
  padding: 10px;
  text-align: center;
  border: 1px solid #fffcfc;
  white-space: pre-line; /* Permite saltos de línea */
  line-height: 1.5; /* Ajusta la separación entre líneas */
}

.day {
  background-color: #ffffff;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  height: 40px; /* Ajusta según sea necesario */
  width: 40px; /* Ajusta según sea necesario */
}

.icon-style {
  font-size: 1.5rem; /* Tamaño del icono */
  color: #333; /* Color del icono */
  display: inline-block;
  vertical-align: middle;
}

.icon-button:hover .icon-style {
  color: #0056b3;
}
</style>
