<script>
import axios from 'axios';
import MyMenu from "../../components/ForMenu/MyMenu.vue";

export default {
  name: "EditSchedulePage",
  components: {MyMenu},
  data() {
    return {
      memberId: this.$route.params.id, // Obtener el ID del trabajador desde los parámetros de la ruta
      schedule: {
        mon: { start: '', end: '', mode: '' },
        tue: { start: '', end: '', mode: '' },
        wed: { start: '', end: '', mode: '' },
        thu: { start: '', end: '', mode: '' },
        fri: { start: '', end: '', mode: '' },
        sat: { start: '', end: '', mode: '' },
        sun: { start: '', end: '', mode: '' }
      },
      error: null
    };
  },
  mounted() {
    // Cargar el horario actual del trabajador cuando el componente se monte
    axios.get(`http://localhost:3000/api/v1/worker/${this.memberId}`)
        .then(response => {
          this.schedule = response.data.schedule;
        })
        .catch(error => {
          this.error = "Error al cargar el horario.";
          console.error(error);
        });
  },
  methods: {
    saveSchedule() {
      // Enviar el horario actualizado al backend
      axios.put(`http://localhost:3000/api/v1/worker/${this.memberId}/schedule`, this.schedule)
          .then(() => {
            alert("Horario actualizado correctamente.");
            this.$router.push({ name: 'HojasDeHoras' }); // Redirigir a la lista de trabajadores
          })
          .catch(error => {
            this.error = "Error al actualizar el horario.";
            console.error(error);
          });
    }
  }
};
</script>

<template>
  <div class="main-layout">
    <MyMenu></MyMenu>
    <div class="content-area">
      <div class="title-container">
        <h2>Editar Horario</h2>
      </div>
      <div class="rounded-box" v-if="error">
        <p>{{ error }}</p>
      </div>

      <form @submit.prevent="saveSchedule" class="rounded-box">
        <div v-for="(day, key) in schedule" :key="key" class="schedule-day">
          <h3>{{ key.toUpperCase() }}</h3>
          <div class="time-range">
            <label>Hora de inicio:
              <input type="time" v-model="day.start" required class="styled-select" />
            </label>
            <label>Hora de fin:
              <input type="time" v-model="day.end" required class="styled-select" />
            </label>
          </div>
          <div class="mode-buttons">
            <button
                type="button"
                :class="['mode-button', { active: day.mode === 'Presencial' }]"
                @click="day.mode = 'Presencial'"
            >
              Presencial
            </button>
            <button
                type="button"
                :class="['mode-button', { active: day.mode === 'Virtual' }]"
                @click="day.mode = 'Virtual'"
            >
              Virtual
            </button>
            <button
                type="button"
                :class="['mode-button', { active: day.mode === 'Libre' }]"
                @click="day.mode = 'Libre'"
            >
              Libre
            </button>
          </div>
        </div>
        <button type="submit" class="guardar">Guardar Cambios</button>
      </form>
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
  margin-bottom: 20px;
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

.styled-select {
  border: 2px solid #e6e6e6;
  border-radius: 15px;
  padding: 5px;
  outline: none;
  transition: background-color 0.3s;
}

.styled-select:hover {
  background-color: #e6e6e6;
}

.mode-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.mode-button {
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  background-color: #ffffff;
  border-radius: 4px;
  font-size: 0.9rem;
  border: 1px solid lightgrey;
  color: black;
  transition: background-color 0.3s;
}

.mode-button.active {
  border: 2px solid #0071dc;
  color: #000000;
}

.guardar {
  border: 2px solid #079cff;
  border-radius: 10px;
  padding: 7px;
  outline: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.guardar:hover {
  background-color: #079cff;
  color: white;
}
</style>
