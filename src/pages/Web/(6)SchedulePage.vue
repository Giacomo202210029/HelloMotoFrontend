<script>
import MyMenu from "../../components/ForMenu/MyMenu.vue";
import axios from 'axios';

export default {
  name: 'HojasDeHoras',
  components: { MyMenu },
  data() {
    return {
      searchQuery: '',
      members: [],
      error: null   // Para mostrar errores si la carga falla
    };
  },
  computed: {
    // Filtra los miembros según la búsqueda
    filteredMembers() {
      return this.members.filter(member =>
          member.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    // Cargar los miembros y sus horarios desde la API
    async loadMembers() {
      try {
        // Realiza la solicitud GET al backend para obtener los miembros
        const response = await axios.get('http://localhost:3000/api/v1/data');
        const members = response.data;

        // Mapear los miembros para obtener el nombre de su área
        const membersWithAreaNames = await Promise.all(
            members.map(async (member) => {
              try {
                // Llamada a la API para obtener el nombre del área por ID
                const areaResponse = await axios.get(`http://localhost:3000/api/v1/area/name/${member.area}`);
                const areaName = areaResponse.data.name;
                return {...member, areaName}; // Añadir el nombre del área
              } catch (error) {
                console.error(`Error al obtener el nombre del área para ID ${member.area}:`, error);
                return {...member, areaName: 'Área desconocida'}; // Valor por defecto en caso de error
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

    // Método para redirigir a la página de edición del horario
    editSchedule(member) {
      if (member.id) {
        this.$router.push({name: 'EditSchedulePage', params: {id: member.id}});
      } else {
        console.error("El ID del miembro no está definido:", member);
      }
    },
    addSchedule() {
      this.$router.push('schedule/add');
    }
  },
  mounted() {
    this.loadMembers(); // Cargar los miembros cuando el componente se monte
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
        <h2 style="font-size: 3rem;">Hojas de horas</h2>
      </div>

      <!-- Si hay un error, mostrar un mensaje -->
      <div v-if="error" class="error-message">
        <p>{{ error }}</p>
      </div>

      <div class="rounded-box">
        <i class="pi pi-search"/>
        <input
            type="text"
            v-model="searchQuery"
            placeholder="Buscar personas..."
            class="search-input"
        />
        <!-- Mostrar la lista de miembros y sus horarios -->
        <div class="person-list" v-if="!error">
          <table>
            <thead>
            <tr>
              <th>Miembros</th>
              <th>L</th>
              <th>M</th>
              <th>M</th>
              <th>J</th>
              <th>V</th>
              <th>S</th>
              <th>D</th>
              <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="member in filteredMembers" :key="member.id">
              <td>
                <div class="sobrepuesta">
                  <i class="pi pi-user"><span class="circle"></span></i>
                </div>
                <div class="member-name">{{ member.name }}</div>
                <div class="member-area">{{ member.areaName }}</div>
              </td>
              <!-- Mostrar los horarios de cada día -->
              <td class="Horario">
                {{ member.schedule.mon.start }}<br/>
                {{ member.schedule.mon.end }}<br/>
                {{ member.schedule.mon.mode }}
              </td>
              <td class="Horario">
                {{ member.schedule.tue.start }}<br/>
                {{ member.schedule.tue.end }}<br/>
                {{ member.schedule.tue.mode }}
              </td>
              <td class="Horario">
                {{ member.schedule.wed.start }}<br/>
                {{ member.schedule.wed.end }}<br/>
                {{ member.schedule.wed.mode }}
              </td>
              <td class="Horario">
                {{ member.schedule.thu.start }}<br/>
                {{ member.schedule.thu.end }}<br/>
                {{ member.schedule.thu.mode }}
              </td>
              <td class="Horario">
                {{ member.schedule.fri.start }}<br/>
                {{ member.schedule.fri.end }}<br/>
                {{ member.schedule.fri.mode }}
              </td>
              <td class="Horario">
                {{ member.schedule.sat.start }}<br/>
                {{ member.schedule.sat.end }}<br/>
                {{ member.schedule.sat.mode }}
              </td>
              <td class="Horario">
                {{ member.schedule.sun.start }}<br/> 
                {{ member.schedule.sun.end }}<br/>
                {{ member.schedule.sun.mode }}
              </td>
              <td class="Horario">
                <button class="edit-button" @click="editSchedule(member)">
                  <i class="pi pi-pen-to-square"></i>
                </button>
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
/* Tu código de estilos sigue igual */
.pi-pen-to-square {
  font-size: 1.4rem;
}
.pi-search {
  margin-bottom: 0px;
  margin-right: 5px;
}
.member-name {
  margin-left: 45px;
}

.Horario {
  font-size: 15px;
}

.member-area {
    color: #555;
  margin-left: 45px;
  margin-bottom: 0px;
}

.sobrepuesta {
  position: relative;
  width: 200px;
  height: 0px;
}

.pi-user {
  color: #079cff;
  font-size: 1.5rem;
  margin-top: 10px;
  margin-left: 7.5px;
  margin-right: 10px;
  left: 200px;
}

.circle {
  width: 40px;
  height: 40px;
  border: 2px solid #079cff;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: +1;
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

.search-input {
  flex: 1; /* Haz que el input ocupe todo el espacio disponible */
  margin-top: 10px; /* Margen superior más corto */
  margin-bottom: 25px; /* Margen inferior más largo */
}

.person-list table {
  width: 100%;
  border-collapse: collapse;
}

.person-list th,
.person-list td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.person-list th {
  background-color: #f2f2f2;
}

.person-list tr:hover {
  background-color: #f9f9f9;
}

.edit-button {
  padding: 5px 10px;
  background-color: #ffffff;
  color: #079cff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-button:hover {
  background-color: #ffffff;
}

</style>
