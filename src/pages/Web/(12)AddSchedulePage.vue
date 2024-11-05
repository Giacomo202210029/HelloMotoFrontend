<template>
  <div class="main-layout">
    <MyMenu></MyMenu>
    <div class="content-area">
      <!-- Título principal -->
      <div class="title-container">
        <h2>Horarios de trabajo</h2>
      </div>

      <div class="content-container">
        <!-- Barra lateral izquierda (Búsqueda y lista de áreas) -->
        <div class="left-sidebar">
          <div class="area-pane">
            <!-- Barra de búsqueda -->
            <div class="search-container">
              <input
                  type="text"
                  id="searchInput"
                  placeholder="Buscar..."
                  v-model="searchTerm"
              />
            </div>

            <!-- Lista de áreas filtradas -->
            <div class="area-list">
              <div v-for="(area, index) in filteredAreas" :key="index" class="user-area">
                <p>Horario {{ index + 1 }}</p>
                <p>{{ area.name }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Contenido a la derecha (Días de la semana y configuración de horarios) -->
        <div class="right-content">
          <div class="days-of-week">
            <span>Días de la semana:</span>
            <div class="days">
              <button
                  v-for="(day, index) in ['L', 'M', 'M', 'J', 'V', 'S', 'D']"
                  :key="index"
                  :class="{ selected: selectedDays[Object.keys(selectedDays)[index]] }"
                  @click="selectedDays[Object.keys(selectedDays)[index]] = !selectedDays[Object.keys(selectedDays)[index]]"
                  class="day-button"
              >
                {{ day }}
              </button>
            </div>
          </div>

          <!-- Configuración de horarios por día -->
          <div v-for="day in selectedDayKeys" :key="day" class="schedule-day">
            <h3>{{ day.toUpperCase() }}:</h3>
            <div class="time-range">
              <label for="startTime">Inicio</label>
              <input type="time" v-model="schedule[day].start" />
              <span>a</span>
              <label for="endTime">Fin</label>
              <input type="time" v-model="schedule[day].end" />
              <div class="mode-buttons">
                <button
                    :class="{ active: schedule[day].mode === 'Virtual' }"
                    @click="setMode(day, 'Virtual')"
                    class="mode-button"
                >
                  V
                </button>
                <button
                    :class="{ active: schedule[day].mode === 'Presencial' }"
                    @click="setMode(day, 'Presencial')"
                    class="mode-button"
                >
                  P
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import MyMenu from "../../components/ForMenu/MyMenu.vue";

export default defineComponent({
  components: { MyMenu },
  data() {
    return {
      searchTerm: '',
      areas: [
        { name: 'Android-Analisis' },
        { name: 'Analisis 2' },
        { name: 'Wordpress' },
        { name: 'Videojuegos' },
      ],
      selectedDays: {
        LUNES: false,
        MARTES: false,
        MIERCOLES: false,
        JUEVES: false,
        VIERNES: false,
        SABADO: false,
        DOMINGO: false,
      },
      schedule: {
        LUNES: { start: '', end: '', mode: 'Virtual' },
        MARTES: { start: '', end: '', mode: 'Virtual' },
        MIERCOLES: { start: '', end: '', mode: 'Virtual' },
        JUEVES: { start: '', end: '', mode: 'Virtual' },
        VIERNES: { start: '', end: '', mode: 'Virtual' },
        SABADO: { start: '', end: '', mode: 'Virtual' },
        DOMINGO: { start: '', end: '', mode: 'Virtual' },
      }
    };
  },
  computed: {
    filteredAreas() {
      const term = this.searchTerm.toLowerCase();
      return this.areas.filter(area =>
          area.name.toLowerCase().includes(term)
      );
    },
    selectedDayKeys() {
      return Object.keys(this.selectedDays).filter(day => this.selectedDays[day]);
    }
  },
  methods: {
    setMode(day, mode) {
      this.schedule[day].mode = mode;
    }
  }
});
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
  width: 70%;
  padding: 10px;
}

.area-pane {
  margin-bottom: 20px;
}

.search-container {
  margin-bottom: 10px;
}

.search-container input {
  padding: 10px;
  width: 100%;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  font-size: 1rem;
}

.area-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-area {
  padding: 15px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.user-area:hover {
  background-color: #f4f4f4;
}

.days-of-week {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.days {
  display: flex;
  gap: 10px;
  margin-left: 10px;
}

.day-button {
  padding: 10px 20px;
  border: 2px solid #ccc;
  background-color: transparent;
  cursor: pointer;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.day-button:hover {
  border-color: #0071dc;
}

.day-button.selected {
  border-color: #0071dc;
  color: #0071dc;
}

.mode-buttons {
  display: flex;
  gap: 10px;
}

.mode-button {
  padding: 5px 10px;
  border: 2px solid #ccc;
  background-color: transparent;
  cursor: pointer;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

.mode-button:hover {
  border-color: #0071dc;
}

.mode-button.active {
  border-color: #0071dc;
  color: #0071dc;
}
</style>
