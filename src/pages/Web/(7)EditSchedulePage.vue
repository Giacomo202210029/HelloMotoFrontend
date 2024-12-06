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

    //verificar memberId
    if (!this.memberId) {
      console.log('MemberID:', this.$route.params.id);
      console.log('El parámetro ID no está presente.');
      return;
    }
    this.loadSchedule();
  },
  methods: {
    // Limpiar los valores de inicio y fin cuando se selecciona "Día de Descanso"
    clearTimes(day) {
      day.mode = 'Libre';  // Establece el modo a "Libre"
      day.start = '';  // Limpia la hora de inicio
      day.end = '';    // Limpia la hora de fin
    },

    // Función para convertir las claves de los días en inglés a español
    getDayNameInSpanish(day) {
      const daysInSpanish = {
        mon: 'Lunes',
        tue: 'Martes',
        wed: 'Miércoles',
        thu: 'Jueves',
        fri: 'Viernes',
        sat: 'Sábado',
        sun: 'Domingo'
      };
      return daysInSpanish[day] || day;  // Retorna el nombre en español o el nombre original si no lo encuentra
    },

    // Convertir AM/PM a 24 horas
    convertirAMPMa24Horas(horaAMPM) {
      const regex = /(\d{1,2}):(\d{2})\s*(am|pm)/i;
      const partes = horaAMPM.match(regex);

      if (!partes) return null;

      let [_, hora, minutos, ampm] = partes;

      hora = parseInt(hora);
      if (ampm.toLowerCase() === 'pm' && hora !== 12) {
        hora += 12; // Convertimos las horas PM a formato de 24 horas
      } else if (ampm.toLowerCase() === 'am' && hora === 12) {
        hora = 0; // 12 AM se convierte en 00:00
      }

      return `${hora.toString().padStart(2, '0')}:${minutos}`;
    },

    // Convertir 24 horas a AM/PM
    convertir24HorasAMPM(hora24) {
      const partes = hora24.split(':');
      let hora = parseInt(partes[0]);
      const minutos = partes[1];

      let ampm = 'am';

      if (hora >= 12) {
        ampm = 'pm';
        if (hora > 12) hora -= 12;
      } else if (hora === 0) {
        hora = 12; // 00:00 se convierte en 12:00 AM
      }

      return `${hora.toString().padStart(2, '0')}:${minutos} ${ampm}`;
    },

    // Método para cargar el horario del trabajador desde el backend
    loadSchedule() {
      axios.get(`http://localhost:3000/api/v1/worker/${this.memberId}`)
          .then(response => {
            // Asignar los horarios cargados a la variable schedule
            this.schedule = response.data.schedule;
            for(let dia in this.schedule) { // Convertir las horas de AM/PM a 24 horas
              let day = this.schedule[dia];
              if (day.start) {
                day.start = this.convertirAMPMa24Horas(day.start);
              }
              if (day.end) {
                day.end = this.convertirAMPMa24Horas(day.end);
              }
            }
          })
          .catch(error => {
            this.error = 'Error al cargar el horario.';
            console.error(error);
          });
    },
    saveSchedule() {
      // Convertir las horas de 24 horas a AM/PM antes de enviar al backend
      for (let dia in this.schedule) {
        let day = this.schedule[dia];
        if (day.start) {
          day.start = this.convertir24HorasAMPM(day.start);
        }
        if (day.end) {
          day.end = this.convertir24HorasAMPM(day.end);
        }
      }

      // Enviar el horario actualizado al backend
      axios.put(`http://localhost:3000/api/v1/worker/${this.memberId}/schedule`, this.schedule)
          .then(() => {
            alert("Horario actualizado correctamente.");
            this.$router.push({ name: 'SchedulePage' }); // Redirigir a la lista de trabajadores
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
          <h3>{{ getDayNameInSpanish(key) }}</h3>
          <div class="time-range">
            <label>Hora de inicio:
              <input type="time" v-model="day.start"  class="styled-select"  />
            </label>
            <label>Hora de fin:
              <input type="time" v-model="day.end"  class="styled-select" />
            </label>
          </div>
          <div class="mode-buttons">
            <button
                type="button"
                :class="['mode-button', { active: day.mode === 'Presencial' }]"
                @click="day.mode = 'Presencial'"
            >
              P
            </button>
            <button
                type="button"
                :class="['mode-button', { active: day.mode === 'Virtual' }]"
                @click="day.mode = 'Virtual'"
            >
              V
            </button>
            <button
                type="button"
                :class="['mode-button', { active: day.mode === 'Libre' }]"
                @click="clearTimes(day)"
            >
              Dia de Descanso
            </button>
          </div>
        </div>
        <!-- Espacio entre el formulario y el botón -->
        <div class="button-container">
          <button type="submit" class="guardar" >Guardar Cambios</button>

          <button type="button" class="cancelar" @click="this.$router.push({ name: 'SchedulePage' });">Cancelar</button>
        </div>
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

.guardar, .cancelar {
  border: 2px solid #079cff;
  border-radius: 10px;
  padding: 7px;
  outline: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.guardar:hover, .cancelar:hover {
  background-color: #079cff;
  color: white;
}

.button-container{
  margin-top: 20px;  /* Agrega el espacio entre el último div y el botón */
  display: flex;
  gap: 20px; /* Espacio de 20px entre los elementos del contenedor */
}


</style>
