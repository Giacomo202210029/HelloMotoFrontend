<script>
import MyMenu from "../../components/ForMenu/MyMenu.vue";
import { Chart, registerables } from "chart.js";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "jspdf-autotable";

Chart.register(...registerables);

export default {
  name: "Informes",
  components: { MyMenu },
  data() {
    return {
      searchTerm: "",
      selectedUser: null,
      users: [
        { name: "Diego Alonso", title: "Android - Fisica" },
        { name: "Manuel Echeverria", title: "Android - Analisis" },
        { name: "Oscar Arias", title: "Android - Analisis" },
        { name: "Andrea Santiesteban", title: "Android - Analisis" },
        { name: "Marcelo Scerpella", title: "Android - Analisis" },
      ],
      store: {
        "Diego Alonso": {
          chartData: [20, 22, 21, 20, 10, 0, 0],
          chartData2: [5, 5, 5, 5, 2, 0, 0],
          chartData3: [1, 2, 3, 1, 0, 0, 0],
          schedule: [
            "9:00 am - 5:00 pm  virtual",
            "9:00 am - 5:00 pm  virtual",
            "9:00 am - 5:00 pm  virtual",
            "9:00 am - 5:00 pm  virtual",
            "10:00 am - 2:00 pm  virtual",
            "Descanso",
            "Descanso",
          ],
        },

        "Manuel Echeverria": {
          chartData: [20, 22, 21, 20, 10, 0, 0],
          chartData2: [5, 5, 5, 5, 2, 0, 0],
          chartData3: [0, 2, 3, 0, 0, 0, 0],
          schedule: [
            "8:00 am - 5:00 pm  virtual",
            "9:00 am - 5:00 pm  virtual",
            "9:00 am - 5:00 pm  virtual",
            "9:00 am - 5:00 pm  virtual",
            "10:00 am - 2:00 pm  virtual",
            "Descanso",
            "Descanso",
          ],
        },

        "Oscar Arias": {
          chartData: [20, 22, 21, 20, 10, 0, 0],
          chartData2: [5, 5, 2, 5, 2, 0, 0],
          chartData3: [1, 1, 0, 1, 0, 0, 0],
          schedule: [
            "9:00 am - 4:00 pm  virtual",
            "9:00 am - 4:00 pm  virtual",
            "9:00 am - 4:00 pm  virtual",
            "9:00 am - 4:00 pm  virtual",
            "10:00 am - 2:00 pm  virtual",
            "Descanso",
            "Descanso",
          ],
        },

        "Andrea Santiesteban": {
          chartData: [20, 22, 21, 10, 10, 0, 0],
          chartData2: [5, 2, 5, 2, 2, 0, 0],
          chartData3: [0, 2, 3, 0, 0, 0, 0],
          schedule: [
            "9:00 am - 5:00 pm  virtual",
            "10:00 am - 5:00 pm  virtual",
            "9:00 am - 5:00 pm  virtual",
            "9:00 am - 5:00 pm  virtual",
            "9:00 am - 2:00 pm  virtual",
            "Descanso",
            "Descanso",
          ],
        },

        "Marcelo Scerpella": {
          chartData: [20, 20, 20, 20, 10, 0, 0],
          chartData2: [5, 5, 2, 5, 2, 0, 0],
          chartData3: [1, 2, 1, 1, 0, 0, 0],
          schedule: [
            "8:00 am - 5:00 pm  virtual",
            "8:00 am - 5:00 pm  virtual",
            "8:00 am - 5:00 pm  virtual",
            "8:00 am - 5:00 pm  virtual",
            "9:00 am - 12:30 pm  virtual",
            "Descanso",
            "Descanso",
          ],
        },
        // Other user data...
      },
      chart: null,
    };
  },
  computed: {
    filteredUsers() {
      const term = this.searchTerm.toLowerCase();
      return this.users.filter(
          (user) =>
              user.name.toLowerCase().includes(term) ||
              user.title.toLowerCase().includes(term)
      );
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
    this.createChart(); // Inicializar el gráfico cuando se monta el componente
  },
  methods: {
    // Método para crear el gráfico
    createChart() {
      const ctx = this.$refs.hoursChart.getContext("2d");
      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["L", "M", "M", "J", "V", "S", "D"],
          datasets: [
            {
              label: "Horas Trabajadas",
              data: this.activeChartData,
              backgroundColor: "rgba(76, 175, 80, 0.5)",
            },
            {
              label: "Descansos",
              data: this.activeChartData2,
              backgroundColor: "rgba(255, 165, 0, 0.5)",
            },
            {
              label: "Horas Extras",
              data: this.activeChartData3,
              backgroundColor: "rgba(255, 0, 0, 0.5)",
            },
          ],
        },
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

    // Método para seleccionar un usuario
    selectUser(user) {
      if (this.selectedUser === user) {
        this.selectedUser = null;
      } else {
        this.selectedUser = user;
      }
      this.createChart(); // Crear el gráfico con los datos del usuario seleccionado
    },

    // Método para descargar el PDF
    downloadPDF() {
      const doc = new jsPDF();

      // Verificar si hay un usuario seleccionado
      const userName = this.selectedUser ? this.selectedUser.name : "Usuario Desconocido";

      // Agregar el título con el nombre del usuario
      doc.setFontSize(18);
      doc.text(`Reporte de Horario - ${userName}`, 20, 20);

      // Capturar el panel del gráfico como imagen
      html2canvas(this.$refs.hoursChart).then((canvas) => {
        doc.addImage(canvas.toDataURL("image/png"), "PNG", 20, 30, 180, 100);

        // Preparar los datos del horario
        const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
        const scheduleTable = days.map((day, index) => [day, this.activeSchedule[index] || "N/A"]);

        // Agregar el horario en forma de tabla
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

        // Guardar el PDF
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
                <p>{{ user.title }}</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div class="main-content" style="background-color: #ebeced;">
        <h2 class="title">
          Crea tus horarios personalizados
          <button class="icon-button" @click="downloadPDF">
            <i class="pi pi-download icon-style"></i>
          </button>
        </h2>

        <div class="card">
          <div class="content">
            <canvas id="hoursChart" ref="hoursChart" width="533" height="300"></canvas>
          </div>
        </div>
        <div class="card horario-card">
          <h2 class="small-title">HORARIO</h2>
          <table class="horario-table">
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
              <td v-for="(hour, index) in activeSchedule" :key="index">
                <template v-if="hour.includes('-')">
                  <span>{{ hour.split('-')[0].trim() }}</span><br>
                  <span>{{ hour.split('-')[1].split('  ')[0].trim() }}</span><br>
                  <span>{{ hour.split('  ')[1].trim() }}</span>
                </template>
                <template v-else>
                  {{ hour }}
                </template>
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
/* Botón de usuario */
.user-button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  width: 100%;
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
  padding: 20px;
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
  font-size: 24px;
  margin-bottom: 20px;
  color: #8f8c8c;
  font-weight: 300;
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

/* Botón de descarga */
.icon-style {
  color: black;
  font-size: 26px;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 590px;
  padding: 2px;
}

.icon-button:hover .icon-style {
  color: #0056b3;
}
</style>

