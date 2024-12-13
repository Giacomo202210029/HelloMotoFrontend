<script>
import MyMenu from "../../components/ForMenu/MyMenu.vue";
import {Chart, registerables} from "chart.js";
import {jsPDF} from "jspdf";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import axios from 'axios';

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
    async fetchWorkers() {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/data");
        let workers = response.data;

        // Asigna la lista de miembros actualizada al estado
        workers = await Promise.all(
            workers.map(async (worker) => {
              try {
                // Llamada a la API para obtener el nombre del área por ID
                const areaResponse = await axios.get(`http://localhost:3000/api/v1/area/name/${worker.area}`);
                const areaName = areaResponse.data.name;

                return { ...worker, areaName };

              } catch (error) {
                console.error(`Error al obtener el nombre del área para ID ${worker.area}:`, error);
                return { ...worker, areaName: 'Área desconocida'};               }
            })
        );

        console.log(workers)

        // Reemplazamos users con la información extraída de los trabajadores
        this.users = workers.map(worker => ({
          name: worker.name,
          areaName: worker.areaName,
          schedule: worker.schedule,
          id: worker.id,
        }));


        if (workers.length > 0) {
          //this.watchWorkerRegistry(workers[0]); // Seleccionar el primer trabajador por defecto
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
      console.log("selectUser called with user:", user);

      // Si el usuario ya está seleccionado, deseleccionarlo
      if (this.selectedUser === user) {
        console.log("Deseleccionando usuario:", user);
        this.selectedUser = null;
      } else {
        console.log("Seleccionando nuevo usuario:", user);
        this.selectedUser = user;
      }

      console.log("Usuario seleccionado actualmente:", this.selectedUser);

      // Actualizar los datos del gráfico y horario basados en el usuario seleccionado
      if (this.selectedUser) {
        console.log("Actualizando gráfico y datos del horario para:", this.selectedUser.name);

        // Si existe un método para actualizar el gráfico
        if (this.createChart) {
          this.createChart(); // Crear o actualizar el gráfico basado en `selectedUser`
          console.log("Gráfico actualizado para el usuario:", this.selectedUser.name);
        }
      } else {
        console.log("No hay usuario seleccionado. Mostrando valores predeterminados.");
        if (this.createChart) {
          this.createChart(); // Mostrar datos generales si no hay usuario seleccionado
          console.log("Gráfico restablecido a los valores generales.");
        }
      }
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
        const scheduleTable = days.map((day, index) => [day, this.activeSchedule[index] || "N/A"]);

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
