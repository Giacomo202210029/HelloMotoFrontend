<script>
import MyMenu from "../../components/ForMenu/MyMenu.vue";
import WorkerMap from "../../components/ForMap/WorkerMap.vue";
import axios from "axios";

export default {
  name: 'MembersPage',
  components: {
    WorkerMap,
    MyMenu
  },
  data() {
    return {
      members: [], // Inicialmente vacío
      errorMessage: '',// Para manejar errores
      area: [],
    };
  },
  mounted() {
    this.getMembers(); // Llamar a la función al cargar el componente
  },
  methods: {
    // Método para obtener los miembros del backend
    async getMembers() {
      try {
        // Realiza la solicitud GET al backend para obtener los miembros
        const response = await axios.get('http://localhost:3000/api/v1/data');
        const members = response.data;

        // Mapear los miembros para obtener los nombres de las áreas (procesando arrays)
        const membersWithAreaNames = await Promise.all(
            members.map(async (member) => {
              try {
                let areaNames = []; // Almacén de los nombres del área

                // Si el área es un arreglo, iterar sobre cada ID
                if (Array.isArray(member.area)) {
                  const areaRequests = member.area.map(async (areaId) => {
                    try {
                      const areaResponse = await axios.get(`${url}area/name/${areaId}`);
                      return areaResponse.data.name; // Retorna el nombre del área
                    } catch (error) {
                      console.error(`Error al obtener el nombre del área para ID ${areaId}:`, error);
                      return "Área desconocida"; // Valor por defecto en caso de error
                    }
                  });

                  // Esperar a que todas las solicitudes del área se completen
                  areaNames = await Promise.all(areaRequests);
                } else {
                  areaNames = ["Área desconocida"];
                }

                return { ...member, areaNames }; // Agregar nombres del área
              } catch (error) {
                console.error(`Error procesando las áreas del miembro:`, error);
                return { ...member, areaNames: ["Área desconocida"] };
              }
            })
        );

        // Asigna la lista de miembros actualizada al estado
        this.members = membersWithAreaNames;
      } catch (error) {
        console.error('Error al obtener los miembros:', error);
        this.errorMessage = 'Ocurrió un error al obtener los miembros.';
      }
    },
    // Método para manejar el chat (opcional si lo necesitas)
    chatWith() {
      this.$router.push(`/chat`);
    }
  } //es por chat en vez de chat page creo
};
</script>

<template>
  <div class="main-layout">
    <!-- Barra lateral -->
    <MyMenu></MyMenu>

    <!-- Contenido -->
    <div class="content-area">
      <div class="title-container">
        <h2 style="font-size: 3rem;">Localizaciones</h2>
      </div>

      <div class="rounded-box">
          <WorkerMap :workers="members" />


        <!-- Mostrar solo cuando los datos de los miembros estén listos -->
        <div v-if="members.length > 0" class="people-list">
          <div class="person-card" v-for="(member, index) in members" :key="index">
            <div class="person-header">
              <i class="pi pi-user user-icon"></i>
              <div class="name-email-container">
                <h4>{{ member.name }}</h4>
                <p class="email">{{ member.email }}</p>
              </div>
            </div>
            <p class="info">Teléfono: {{ member.phone }}</p>
            <p class="info">Áreas: {{ member.areaNames.join(", ") }}</p>
            <p class="info">Institución: {{ member.institution }}</p>
            <button class="chat-button" @click="chatWith(member)">
              <i class="pi pi-comments"></i> Chat
            </button>
          </div>
        </div>

        <!-- Mostrar un mensaje de carga o de datos vacíos -->
        <div v-else>
          <p>Cargando miembros o no hay datos disponibles.</p>
        </div>
      </div>
    </div>
  </div>
</template>


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

h2 {
  margin: 0;
}

.rounded-box {
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.map-container {
  margin-bottom: 20px; /* Margen alrededor del mapa */
}

.people-list {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 2 columnas siempre */
  gap: 20px; /* Espacio entre las tarjetas */
}

.person-card {
  border: 1px solid #e0e0e0;
  padding: 15px;
  border-radius: 8px;
  text-align: left; /* Justificado a la izquierda */
}


.person-header {
  display: flex;
  align-items: flex-start; /* Alineación a la parte superior */
  justify-content: flex-start; /* Alineación a la izquierda */
}

.user-icon {
  margin-right: 5px; /* Espacio reducido entre el icono y el nombre */
  font-size: 2rem; /* Aumenta el tamaño del ícono */
  color: #0071dc; /* Color del ícono */
}

.name-email-container {
  display: flex;
  flex-direction: column; /* Coloca nombre y correo en columna */
}

.email {
  font-size: 0.8rem; /* Tamaño de letra más pequeño */
  color: #555; /* Color gris para el correo */
  margin: 0; /* Sin margen */
  line-height: 1; /* Sin interlineado */
}

.info {
  margin: 5px 0; /* Espacio entre líneas de información */
}

.chat-button {
  padding: 5px 10px;
  border: 2px solid #0071dc; /* Borde azul */
  background-color: white; /* Fondo blanco */
  color: #0071dc; /* Texto azul */
  border-radius: 20px; /* Bordes redondeados */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.chat-button:hover {
  background-color: #0071dc; /* Fondo azul al pasar el mouse */
  color: white; /* Texto blanco al pasar el mouse */
}

.chat-button i {
  margin-right: 5px; /* Espacio entre ícono y texto */
}
</style>

/*navigator.geolocation.getCurrentePosition(position =>{
this.center ={
lat: position.coords.latitude
lng: position.coords.longitude

*/

