<script>
import MyMenu from "../../components/ForMenu/MyMenu.vue";

export default {
  name: 'MembersPage',
  components: {
    MyMenu
  },
  data() {
    return {
      searchQuery: '',
      members: [
        { name: 'Diego Alonso', email: 'diego@example.com', phone: '123-456-7890', area: 'Desarrollo', institution: 'Ejemplo S.A.' },
        { name: 'Manuel Echeverria', email: 'manuel@example.com', phone: '987-654-3210', area: 'Recursos Humanos', institution: 'Ejemplo S.A.' },
        { name: 'Oscar Arias', email: 'oscar@example.com', phone: '456-789-1230', area: 'Marketing', institution: 'Ejemplo S.A.' },
        { name: 'Andrea Santiesteban', email: 'andrea@example.com', phone: '321-654-9870', area: 'Desarrollo', institution: 'Ejemplo S.A.' },
        { name: 'Marcelo Scerpella', email: 'marcelo@example.com', phone: '654-321-0987', area: 'Desarrollo', institution: 'Ejemplo S.A.' },
      ]
    };
  },
  methods: {
    editMember(member) {
      alert(`Editar miembro: ${member.name}`);
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
        <h2 style="font-size: 3rem;">Personas</h2>
      </div>

      <div class="rounded-box">
        <div class="person-list">
          <table>
            <thead>
            <tr>
              <th>
                <i class="pi pi-search"></i>
                <input
                    type="text"
                    v-model="searchQuery"
                    placeholder="Buscar personas..."
                    class="search-input"
                />
              </th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Área</th>
              <th>Institución</th>
              <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="member in members" :key="member.name">
              <td>
                <!--<div class="circle">-->
                <div class="sobrepuesta">
                <i class="pi pi-user" ><span class="circle"></span></i>
                </div><!--<i class="fas fa-user"></i> Icono de persona -->
                <div class="member-name">{{ member.name }}</div>

                <!--</div>-->
                <div class="member-area">{{ member.area }}</div>
              </td>
              <td>{{ member.email }}</td>
              <td>{{ member.phone }}</td>
              <td>{{ member.area }}</td>
              <td>{{ member.institution }}</td>
              <td>
                <router-link to="/EditMember">

                  <button class="edit-button" @click="editMember"><i class="pi pi-pen-to-square"></i></button>
                </router-link>
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
.member-name{
  margin-left: 45px;
}
.sobrepuesta{
  position: relative; /* Necesario para el posicionamiento absoluto de los hijos */

  width: 200px; /* Ajusta según tus necesidades */
  height: 0px; /* Ajusta según tus necesidades */
}
.pi-user{
  /*font-size: 1.5rem;*/
  color: #079cff; /* Cambia el color del ícono aquí */
  font-size: 1.5rem;
  margin-top: 10px; /* Igual que el anterior para que se superpongan */
  margin-left:7.5px;
  margin-right:10px;
  left: 200px; /* Igual que el anterior */
}
.circle {
  width: 40px;
  height: 40px;
  border: 2px solid #079cff; /* Cambia el color del borde aquí */
  border-radius: 50%;
  position: absolute;
  top: 0; /* Igual que el anterior para que se superpongan */
  left: 0; /* Igual que el anterior */
  z-index: +1;
}


.pi-pen-to-square{
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
  background-color: #e0a800;
}

.member-area {
  font-size: 0.8rem;
  color: #555;
  margin-left: 45px;
  margin-bottom:0px;
}

.fas.fa-user {
  margin-right: 5px; /* Espacio entre el ícono y el nombre */
  color: #0071dc; /* Color del ícono */
}
</style>
