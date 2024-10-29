<template>
  <AppBar title="Chat" style="position: fixed" />
  <NavBar style="position: fixed" />
  <div class="chat-container">
    <div class="user-list">
      <input type="text" placeholder="Buscar..." v-model="searchQuery" />
      <div
          v-for="(user, index) in filteredUsers"
          :key="user.id"
          class="user-item"
          @click="selectUser(user)"
      >
        <div :class="{'user-selectead': selectedUser?.id === user.id}">
          <i class="pi pi-user"></i>
          <span>{{ user.name }} - {{ user.profession }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { io } from "socket.io-client";
import AppBar from "../../components/ForMobile/AppBar.vue";
import NavBar from "../../components/ForMobile/NavBar.vue";

export default {
  name: "ChatPage1",
  components: { AppBar, NavBar },
  data() {
    return {
      users: [],  // Lista de usuarios que se llenará con los datos del backend
      selectedUser: null,
      searchQuery: "",
    };
  },
  computed: {
    filteredUsers() {
      const query = this.searchQuery.toLowerCase();
      return this.users.filter(
          (user) =>
              user.name.toLowerCase().includes(query) ||
              user.profession.toLowerCase().includes(query)
      );
    },
  },
  mounted() {
    // Hacer una solicitud al backend para obtener los trabajadores
    axios.get('http://localhost:3000/api/v1/data') // Ajusta la URL según tu backend
        .then(response => {
          this.users = response.data.map(worker => ({
            id: worker.id,
            name: worker.name,
            profession: worker.area, // O asigna el campo correcto para 'profession'
            email: worker.email,
          }));
        })
        .catch(error => {
          console.error("Error al obtener los trabajadores", error);
        });
  },
  methods: {
    selectUser(user) {
      this.$router.push({ name: "ChatPage2", params: { userId: user.id } });
    },
  },
};

</script>


<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px; /* Limitar el ancho para adaptarse mejor a pantallas móviles */
  margin-top:5rem;

  padding: 1rem;
  background-color: white;
  font-family: Arial, sans-serif;
}

/* Input de búsqueda */
.user-list input[type="text"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
  outline: none;
}

/* Lista de usuarios */
.user-list {
  display: flex;
  flex-direction: column;
  background-color: white;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* Cada ítem de usuario */
.user-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.user-item:hover {
  background-color: #f1f1f1;
}

/* Icono de usuario y nombre */
.user-item i.pi-user {
  font-size: 1.5rem;
  margin-right: 1rem;
  color: #333;
}

.user-item span {
  font-size: 1rem;
  font-weight: bold;
}

/* Indicar el usuario seleccionado */
.user-selected {
  background-color: #e0e0e0;
}

/* Ajustar el padding del contenedor */
.chat-container {
  padding-bottom: 6rem; /* Para evitar que se superponga con el NavBar */
}


</style>