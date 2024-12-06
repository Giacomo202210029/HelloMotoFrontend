<template>
  <div class="main-layout">
    <MyMenu></MyMenu>
    <div class="content-area">
      <!-- Título principal -->
      <div class="title-container">
        <h2 style="font-size: 3rem;">Horarios de trabajo</h2>
      </div>

      <div class="content-container">
        <!-- Barra lateral izquierda (Búsqueda y lista de áreas) -->
        <div class="left-sidebar">
          <div class="search-container">
            <input
                type="text"
                id="searchInput"
                placeholder="Buscar..."
                v-model="searchTerm"
            />
          </div>
          <button class="add-area-button" @click="addArea">
            + Añadir Horario
          </button>
          <div class="area-list">
            <div
                v-for="area in filteredAreas"
                :key="area.id"
                class="user-area"
                :class="{ active: selectedArea?.id === area.id }"
                @click="selectArea(area)"
            >
              <p>{{ area.name }}</p>
            </div>
          </div>
        </div>

        <!-- Contenido a la derecha (Horarios por día) -->
        <div class="right-content">
          <div v-if="selectedArea">
            <h3>Configuración de Horarios: {{ selectedArea.name }}</h3>
            <div v-for="(schedule, day) in selectedArea.schedule" :key="day" class="schedule-day">
              <h4>{{ formatDay(day) }}</h4>
              <div class="time-range">
                <label>Inicio:</label>
                <input type="time" v-model="schedule.start" />
                <label>Fin:</label>
                <input type="time" v-model="schedule.end" />
                <div class="mode-buttons">
                  <button
                      :class="{ active: schedule.mode === 'Virtual' }"
                      @click="updateMode(day, 'Virtual')"
                  >
                    Virtual
                  </button>
                  <button
                      :class="{ active: schedule.mode === 'Presencial' }"
                      @click="updateMode(day, 'Presencial')"
                  >
                    Presencial
                  </button>
                </div>
              </div>
            </div>
            <button class="save-button" @click="saveSchedule">
              Guardar Cambios
            </button>
          </div>
          <div v-else>
            <p>Selecciona un horario para configurarlo</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import MyMenu from "../../components/ForMenu/MyMenu.vue";

export default {
  components: { MyMenu },
  data() {
    return {
      searchTerm: "",
      areas: [],
      selectedArea: null, // Área seleccionada
      error: null,
    };
  },
  computed: {
    filteredAreas() {
      const term = this.searchTerm.toLowerCase();
      return this.areas.filter((area) =>
          area.name.toLowerCase().includes(term)
      );
    },
  },
  methods: {
    async fetchAreas() {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/area/name");
        this.areas = response.data;
      } catch (error) {
        this.error = "Error al cargar áreas.";
        console.error(error);
      }
    },
    async selectArea(area) {
      try {
        const response = await axios.get(
            `http://localhost:3000/api/v1/area/schedule/${area.id}`
        );
        this.selectedArea = { ...area, schedule: response.data.schedule };
      } catch (error) {
        this.error = "Error al cargar el horario del área seleccionada.";
        console.error(error);
      }
    },
    async addArea() {
      try {
        const response = await axios.post(
            "http://localhost:3000/api/v1/areas",
            {}
        );
        const newArea = response.data.area;
        const areaDetails = await axios.get(
            `http://localhost:3000/api/v1/area/name/${newArea.id}`
        );
        this.areas.push({ id: newArea.id, name: areaDetails.data.name });
        alert("Horario añadido exitosamente.");
      } catch (error) {
        this.error = "Error al añadir un nuevo horario.";
        console.error(error);
      }
    },
    updateMode(day, mode) {
      if (this.selectedArea) {
        this.selectedArea.schedule[day].mode = mode;
      }
    },
    async saveSchedule() {
      if (!this.selectedArea) return;
      try {
        await axios.put(
            `http://localhost:3000/api/v1/area/schedule/${this.selectedArea.id}`,
            { schedule: this.selectedArea.schedule }
        );
        alert("Horario guardado exitosamente.");
      } catch (error) {
        this.error = "Error al guardar el horario.";
        console.error(error);
      }
    },
    formatDay(day) {
      const days = {
        mon: "Lunes",
        tue: "Martes",
        wed: "Miércoles",
        thu: "Jueves",
        fri: "Viernes",
        sat: "Sábado",
        sun: "Domingo",
      };
      return days[day] || day;
    },
  },
  async mounted() {
    await this.fetchAreas();
  },
};
</script>
<style scoped>
.main-layout {
  display: flex;
}

.content-area {
  flex-grow: 1;
  padding: 20px;
  margin-left: 250px;
  background-color: #f9f9f9;
}

.title-container {
  background-color: white;
  padding: 15px;
  margin-bottom: 20px;
  font-size: 50px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.content-container {
  display: flex;
}

.left-sidebar {
  width: 30%;
  padding: 10px;
  border-right: 1px solid #e0e0e0;
}

.right-content {
  flex-grow: 1;
  padding: 10px;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.search-container input {
  width: 100%;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-bottom: 15px;
}

.add-area-button {
  width: 18rem;
  background-color: #ebeced;
  padding: 10px;
  box-shadow: 2px 0 5px rgba(31, 30, 30, 0.1);
  border: 1px solid #87888a;
  cursor: pointer;
  margin-bottom: 15px;
}

.area-list .user-area {
  width: 18rem;
  background-color: #ebeced;
  padding: 10px;
  box-shadow: 2px 0 5px rgba(31, 30, 30, 0.1);
  border: 1px solid #87888a;
  margin-bottom: 5px;
}

.area-list .user-area.active {
  background-color: #0071dc;
  color: white;
}

.mode-buttons button {
  padding: 5px 10px;
  border: 1px solid #e0e0e0;
  background-color: #f4f4f4;
  cursor: pointer;
  margin-left: 5px;
}

.mode-buttons button.active {
  background-color: #0071dc;
  color: white;
}

.save-button {
  margin-top: 20px;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}
</style>
