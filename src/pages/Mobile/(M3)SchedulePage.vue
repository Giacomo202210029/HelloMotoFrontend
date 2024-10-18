<script>
import NavBar from "../../components/ForMobile/NavBar.vue";
import AppBar from "../../components/ForMobile/AppBar.vue";

export default {
name: "MobileSchedulePage",
  components: {AppBar, NavBar}
}
</script>

<template>
  <AppBar title="Hojas de horas" style="position: fixed"/>
  <NavBar style="position: fixed"/>
  <div class="card-container">
    <Card class="ControlPanelCard">
      <div class="section">
        <text>Lunes</text>
        <text class="hours">8:00 am - 5:00pm - Virtual </text>
      </div>
      <div class="section">
        <text>Martes</text>
        <text class="hours">8:00 am - 5:00pm - Virtual </text>
      </div>
      <div class="section">
        <text>Miercoles</text>
        <text class="hours">8:00 am - 5:00pm - Virtual </text>
      </div>
      <div class="section">
        <text>Jueves</text>
        <text class="hours">8:00 am - 5:00pm - Virtual</text>
      </div>
      <div class="section">
        <text>Viernes</text>
        <text class="hours">8:00 am - 5:00pm - Virtual </text>
      </div>
      <div class="section">
        <text>Sabado</text>
        <text class="hours">Día de descanso</text>
      </div>
      <div class="section">
        <text>Domingo </text>
        <text class="hours">Día de descanso</text>
      </div>
    </Card>
    <div class="total">
    <text>Total semanal</text>
    <text>32h 19 m</text>
    </div>
    <Card class="ControlPanelCard">
      <text class="Time">Tiempo Registrado</text>
      <div class="timerow">
        <div class="timesection">
          <text>Ultima Entrada</text>
          <text class="Time">8:00 am</text>
        </div>
        <div class="timesection">
          <text>Ultima Salida</text>
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