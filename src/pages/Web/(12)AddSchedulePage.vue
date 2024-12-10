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
          <button class="add-area-button" @click="openAddAreaModal">
            + Añadir Área
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

        <div v-if="showAddAreaModal" class="modal-overlay">
          <div class="modal-content">
            <h3>Añadir Nueva Área</h3>
            <label>Nombre del Área:</label>
            <input type="text" v-model="newAreaName" placeholder="Nombre del área" />

            <h4>Configurar Horarios:</h4>
            <div v-for="(day, key) in defaultSchedule" :key="key" class="schedule-day">
              <h5>{{ formatDay(key) }}</h5>
              <label>Inicio:</label>
              <input type="time" v-model="day.start" />
              <label>Fin:</label>
              <input type="time" v-model="day.end" />
              <select v-model="day.mode">
                <option value="Virtual">Virtual</option>
                <option value="Presencial">Presencial</option>
              </select>
            </div>

            <div class="modal-buttons">
              <button @click="addArea">Guardar</button>
              <button @click="closeAddAreaModal">Cancelar</button>
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
      showAddAreaModal: false, // Controla si el modal está abierto
      newAreaName: "", // Nombre del área nueva
      error: null,
      defaultSchedule: {
        mon: { start: "08:00", end: "17:00", mode: "Virtual" },
        tue: { start: "08:00", end: "17:00", mode: "Presencial" },
        wed: { start: "08:00", end: "17:00", mode: "Virtual" },
        thu: { start: "08:00", end: "17:00", mode: "Presencial" },
        fri: { start: "08:00", end: "17:00", mode: "Virtual" },
        sat: { start: "Libre", end: "", mode: "" },
        sun: { start: "Libre", end: "", mode: "" },
      },
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
    openAddAreaModal() {
      this.showAddAreaModal = true;
    },
    closeAddAreaModal() {
      this.showAddAreaModal = false;
      this.newAreaName = "";
    },
    async addArea() {
      if (!this.newAreaName.trim()) {
        alert("El nombre del área es obligatorio.");
        return;
      }

      try {
        // Enviar al backend
        const response = await axios.post("http://localhost:3000/api/v1/areas", {
          name: this.newAreaName,
          schedule: this.defaultSchedule,
        });

        // Añadir la nueva área al listado
        this.areas.push(response.data.area);

        // Cerrar el modal
        this.closeAddAreaModal();
        alert("Área añadida exitosamente.");
      } catch (error) {
        this.error = "Error al añadir el área.";
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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

.modal-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.modal-buttons button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.modal-buttons button:first-child {
  background-color: #28a745;
  color: white;
}

.modal-buttons button:last-child {
  background-color: #dc3545;
  color: white;
}

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
