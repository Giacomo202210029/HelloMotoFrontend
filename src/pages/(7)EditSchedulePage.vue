<script>
import MyMenu from "../components/ForMenu/MyMenu.vue";

export default {
  name: 'EditSchedulePage',
  components: {
    MyMenu,
  },
  data() {
    return {
      searchQuery: '',
      selectedMember: null,
      members: [
        { name: 'Diego Alonso', profession: 'Desarrollador' },
        { name: 'Manuel Echeverria', profession: 'Diseñador' },
        { name: 'Oscar Arias', profession: 'Gerente' },
        { name: 'Andrea Santiesteban', profession: 'Analista' },
        { name: 'Marcelo Scerpella', profession: 'Ingeniero' },
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
    selectedDayKeys() {
      return Object.keys(this.selectedDays).filter(day => this.selectedDays[day]);
    }
  },
  methods: {
    selectMember(member) {
      this.selectedMember = member;
      Object.keys(this.schedule).forEach(day => {
        this.schedule[day].start = '';
        this.schedule[day].end = '';
        this.schedule[day].mode = 'Virtual';
      });
    },
    clearSelection() {
      this.selectedMember = null;
      Object.keys(this.selectedDays).forEach(day => {
        this.selectedDays[day] = false;
      });
      Object.keys(this.schedule).forEach(day => {
        this.schedule[day].start = '';
        this.schedule[day].end = '';
        this.schedule[day].mode = 'Virtual';
      });
    },
    setMode(day, mode) {
      this.schedule[day].mode = mode;
    }
  }
};
</script>

<template>
  <div class="main-layout">
    <!-- Barra lateral -->
    <MyMenu></MyMenu>

    <!-- Contenido -->
    <div class="content-area">
      <div class="title-container">
        <h2 style="font-size: 3rem;">Editar Horarios</h2>
      </div>

      <div class="rounded-box">
        <div class="person-selection">
          <select v-model="selectedMember" @change="clearSelection">
            <option value="" disabled selected>Seleccionar Persona</option>
            <option v-for="member in members" :key="member.name" :value="member">
              {{ member.name }} ({{ member.profession }})
            </option>
          </select>
        </div>

        <!-- Sección de Días de la Semana -->
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

        <!-- días seleccionados -->
        <div v-for="day in selectedDayKeys" :key="day" class="schedule-day">
          <h3>{{ day.toUpperCase() }}:</h3>
          <div class="time-range">
            <label for="startTime"></label>
            <input type="time" v-model="schedule[day].start" />
            <span>a</span>
            <label for="endTime"></label>
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

        <button @click="clearSelection">Guardar Cambios</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
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

.user-icon {
  font-size: 1.5rem;
  color: #0071dc;
}

.logout-button {
  background: none;
  border: none;
  color: #0071dc;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.logout-button:hover {
  color: #005bb5;
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

h2 {
  margin: 0;
}

.rounded-box {
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.person-selection {
  margin-bottom: 20px;
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
  border: none;
  background-color: #f0f0f0;
  cursor: pointer;
  border-radius: 8px;
  font-size: 1rem;
}

.day-button.selected {
  background-color: #0071dc;
  color: white;
}

.schedule-day {
  margin-top: 20px;
}

.schedule-day h3 {
  margin: 0 0 10px 0;
}

.time-range {
  display: flex;
  gap: 20px;
  align-items: center;
}

.mode-buttons {
  display: flex;
  gap: 10px;
}

.mode-button {
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.mode-button.active {
  background-color: #0071dc;
  color: white;
}
</style>
