<script>
import axios from "axios";
import AppBar from "../../components/ForMobile/AppBar.vue";
import NavBar from "../../components/ForMobile/NavBar.vue";
import url from "../../services/url.service.js";

export default {
  name: "ChatPage1",
  components: { AppBar, NavBar },
  data() {
    return {
      admins: [], // Lista de usuarios del backend
      selectedUser: null,
      searchQuery: "",
    };
  },
  computed: {
    filteredUsers() {
      const query = this.searchQuery.toLowerCase();
      return this.admins.filter((admin) =>
          admin.name.toLowerCase().includes(query)
      );
    },
  },
  mounted() {
axios.get(`${url}admins`) // Backend
        .then((response) => {
          this.admins = response.data.map((admin) => ({
            id: admin.id,
            name: admin.name,
            areaName: admin.area, // Asocia correctamente el área
          }));
        })
        .catch((error) => {
          console.error("Error al obtener los usuarios", error);
        });
  },
  methods: {
    selectUser(admin) {
      this.selectedUser = admin;
      this.$router.push({ name: "ChatPage2", params: { userId: admin.id } });
    },
  },
};
</script>

<template>
  <AppBar title="Chat" style="position: fixed" />
  <NavBar style="position: fixed" />
  <div class="chat-container">
    <div class="user-list">
      <input type="text" placeholder="Buscar..." v-model="searchQuery" />
      <div
          v-for="(admin, index) in filteredUsers"
          :key="admin.id"
          class="user-item"
          @click="selectUser(admin)"
      >
        <div :class="{ 'user-selected': selectedUser?.id === admin.id }">
          <i class="pi pi-user"></i>
          <span>{{ admin.name }} - {{ admin.area }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  display: flex; /* Activa Flexbox */
  justify-content: center; /* Centrado horizontal */
  align-items: center; /* Centrado vertical */
  height: 100vh; /* Ocupa toda la altura de la pantalla */
  overflow: hidden; /* Previene el desbordamiento */
  background-color: #f0f0f0; /* Color de fondo opcional */
}
.user-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}

.user-item:hover {
  background-color: #f9f9f9;
}

.user-selected {
  background-color: #007bff;
  color: white;
}

.chat-container {
  padding: 5rem 1rem 6rem; /* Ajustes para AppBar y NavBar */
}

/* Lista de usuarios busqueda */
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
  width: 65%;
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