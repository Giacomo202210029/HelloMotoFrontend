<script>
import axios from 'axios'; // Importar Axios
import NavBar from "../../components/ForMobile/NavBar.vue";
import AppBar from "../../components/ForMobile/AppBar.vue";

export default {
  name: "MobileSchedulePage",
  components: { AppBar, NavBar },
  data() {
    return {
      schedule: null,  // Aquí almacenaremos el horario
    };
  },
  mounted() {
    // Hacer la solicitud al backend al montar el componente
    axios.get('http://localhost:3000/api/v1/data') // URL para obtener la lista de trabajadores
        .then(response => {
          // Aquí seleccionamos el primer trabajador (puedes ajustar esto según la lógica que prefieras)
          const worker = response.data.find(worker => worker.id === 1); // Ajusta esto para seleccionar el trabajador adecuado

          if (worker && worker.schedule) {
            this.schedule = worker.schedule; // Almacenar el horario del trabajador seleccionado
          } else {
            console.error('No se encontró el trabajador o el horario no está disponible');
          }
        })
        .catch(error => {
          console.error("Error al obtener el horario", error);
        });
  }
};


</script>

<template>
  <AppBar title="Hojas de horas" style="position: fixed"/>
  <NavBar style="position: fixed"/>

  <div class="card-container" v-if="schedule">
    <Card class="ControlPanelCard">
      <div class="section">
        <text>Lunes</text>
        <text class="hours">{{ schedule.mon.start }} - {{ schedule.mon.end }} - {{ schedule.mon.mode }} </text>
      </div>
      <div class="section">
        <text>Martes</text>
        <text class="hours">{{ schedule.tue.start }} - {{ schedule.tue.end }} - {{ schedule.tue.mode }} </text>
      </div>
      <div class="section">
        <text>Miércoles</text>
        <text class="hours">{{ schedule.wed.start }} - {{ schedule.wed.end }} - {{ schedule.wed.mode }} </text>
      </div>
      <div class="section">
        <text>Jueves</text>
        <text class="hours">{{ schedule.thu.start }} - {{ schedule.thu.end }} - {{ schedule.thu.mode }} </text>
      </div>
      <div class="section">
        <text>Viernes</text>
        <text class="hours">{{ schedule.fri.start }} - {{ schedule.fri.end }} - {{ schedule.fri.mode }} </text>
      </div>
      <div class="section">
        <text>Sábado</text>
        <text class="hours">{{ schedule.sat.start === 'Libre' ? 'Día de descanso' : schedule.sat.start + ' - ' + schedule.sat.end + ' - ' + schedule.sat.mode }}</text>
      </div>
      <div class="section">
        <text>Domingo</text>
        <text class="hours">{{ schedule.sun.start === 'Libre' ? 'Día de descanso' : schedule.sun.start + ' - ' + schedule.sun.end + ' - ' + schedule.sun.mode }}</text>
      </div>
    </Card>
    <div class="total">
      <text>Total semanal</text>
      <text>32h 19m</text>
    </div>
    <Card class="ControlPanelCard">
      <text class="Time">Tiempo Registrado</text>
      <div class="timerow">
        <div class="timesection">
          <text>Última Entrada</text>
          <text class="Time">8:00 am</text>
        </div>
        <div class="timesection">
          <text>Última Salida</text>
          <text class="Time">5:00 pm</text>
        </div>
      </div>
      <div class="timerow">
        <div class="timesection">
          <text>Descansos</text>
          <text class="Time">8:00 am</text>
        </div>
        <div class="timesection">
          <text>Horas trabajadas</text>
          <text class="Time">24h 44m</text>
        </div>
      </div>
    </Card>
  </div>
</template>



<style scoped>
.timerow {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Dos columnas iguales */
  gap: 1rem; /* Espacio entre las columnas */
  padding: 1rem;
  justify-items: center; /* Centrar horizontalmente */
}

.timesection {
  display: flex;
  flex-direction: column;
  align-items: center; /* Centrar el contenido verticalmente */
  text-align: center;
}

.Time {
  font-weight: bold;
  font-size: 0.9rem; /* Ajustar el tamaño del texto */
}



.hours{
  font-weight:bold;
  margin-right: 0.2rem;

}
.section{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.5rem;
}
.card-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* Reducir el espacio entre las tarjetas */
  justify-content: center;
  align-items: center;
  height: calc(100vh);
  padding: 0 0.75rem; /* Reducir el padding en los laterales */
}

/* Estilos de la tarjeta */
.ControlPanelCard {
  width: 100%;
  max-width: 350px; /* Reducir el ancho máximo */
  border-radius: 10px; /* Reducir el radio de borde */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* Ajustar la sombra */
  padding: 0.75rem; /* Reducir el padding interno */
  background-color: white;
  border: 1px solid #ccc; /* Reducir el borde */
}

.total {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 5rem; /* Add space between the elements */
}
</style>