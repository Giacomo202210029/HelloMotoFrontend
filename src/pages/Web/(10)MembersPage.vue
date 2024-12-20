<script>
import MyMenu from "../../components/ForMenu/MyMenu.vue";
import axios from "axios";

export default {
  name: 'MembersPage',
  components: {
    MyMenu
  },
  data() {
    return {
      searchQuery: '',
      members: [], // Lista de miembros cargada desde la API
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
    // Redirigir a la página de edición de un miembro específico
    editMember(member) {
      if (member.id) {
        this.$router.push({name: 'EditMember', params: {id: member.id}});
      } else {
        console.error("El ID del miembro no está definido:", member);
      }
    },
    addMember() {
      this.$router.push({name: 'AddMember'});
    }

  },
  mounted() {
    this.loadMembers(); // Cargar los miembros cuando el componente se monta
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
        <h2 style="font-size: 3rem;">Personas</h2>
      </div>

      <!-- Si hay un error, mostrar un mensaje -->
      <div v-if="error" class="error-message">
        <p>{{ error }}</p>
      </div>

      <div class="rounded-box">

        <!-- Mostrar la lista de miembros y sus horarios -->
        <div class="person-list" v-if="!error">
          <table>
            <thead>
            <div class="header-container">
              <i class="pi pi-search"/>
              <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Buscar personas..."
                  class="search-input"
              />
              <button class="añadir" @click="addMember">
                <p>Añadir miembro</p>
              </button>
            </div>

            <tr>
              <th>Miembros</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Institución</th>
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
                <div class="member-area">{{ member.areaNames.join(" - ") }}</div>
              </td>
              <td>{{ member.email }}</td>
              <td>{{ member.phone }}</td>
              <td>{{ member.institution }}</td>
              <td>
                <button class="edit-button" @click="editMember(member)">
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
/* Estilos para dar formato a la lista de miembros y la interfaz */
.member-name {
  margin-left: 45px;
}

.sobrepuesta {
  position: relative;
  width: 200px;
  height: 0px;
}

.pi-search {
  margin-bottom: 0px;
  margin-right: 5px;
}

.pi-user {
  color: #079cff;
  font-size: 1.5rem;
  margin-top: 10px;
  margin-left: 7.5px;
  margin-right: 10px;
  left: 200px;
}

.header-container {
  display: flex;
  justify-content: space-between; /* Alinear elementos a los extremos */
  align-items: center; /* Centrar verticalmente */
  margin-bottom: 20px;
}

.search-input {
  flex: 1; /* Haz que el input ocupe todo el espacio disponible */
  margin-right: 10px; /* Espacio entre el input y el botón */
}

.añadir {
  background-color: #079cff;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  border-radius: 20px;
  transition: background-color 0.3s;

}

.añadir:hover {
  background-color: #007acc;
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

.pi-pen-to-square {
  font-size: 1.4rem;
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
  font-size: 50px;
  border-radius: 4px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  margin: 0;
}

.rounded-box {
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
}

.rounded-box-2 {
  background-color: #ededed;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  width: 70%;
  margin-bottom: 10px;
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
  background-color: #f9f9f9;
}

.member-area {
  font-size: 0.8rem;
  color: #555;
  margin-left: 45px;
  margin-bottom: 0px;
}

.fas.fa-user {
  margin-right: 5px;
  color: #0071dc;
}
</style>
