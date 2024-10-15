<template>
  <div class="main-layout">
    <!-- Sidebar: MyMenu -->
    <MyMenu class="sidebar"></MyMenu>

    <!-- Resto del contenido: chat-container -->
    <div class="chat-container">
      <!-- Primera columna: Lista de usuarios -->
      <div class="user-list">
        <input type="text" placeholder="Buscar..." v-model="searchQuery" />
        <div v-for="(user, index) in filteredUsers" :key="user.id" class="user-item" @click="selectUser(user)">
          <div :class="{'user-selected': selectedUser?.id === user.id}">
            <i class="pi pi-user"></i> <!-- ícono del usuario -->
            <span>{{ user.name }} - {{ user.profession }}</span>
          </div>
        </div>
      </div>

      <!-- Segunda columna: Mensajes del chat -->
      <div class="chat-section">
        <div class="messages" ref="messageContainer">
          <div v-for="(message, index) in messages" :key="index" class="message-item">
            <span :class="{'own-message': message.user === currentUser.id, 'other-message': message.user !== currentUser.id}">
              {{ message.message }}
            </span>
          </div>
        </div>

        <div class="message-input">
          <input v-model="message" placeholder="Escriba un mensaje..." @keyup.enter="sendMessage" />
          <button @click="sendMessage">
            <i class="pi pi-send"></i>
          </button>
        </div>
      </div>

      <!-- Tercera columna: Información del usuario -->
      <div v-if="selectedUser" class="user-info">
        <div>
          <h2>{{ selectedUser.name }} - {{ selectedUser.profession }}</h2>
          <p><strong>Institución:</strong> {{ selectedUser.institution }}</p>
          <p><strong>Sede:</strong> {{ selectedUser.location }}</p>
          <p><strong>Correo:</strong> {{ selectedUser.email }}</p>
          <p><strong>Número:</strong> {{ selectedUser.phone }}</p>
          <p><strong>Horas trabajadas:</strong> {{ selectedUser.workedHours }}</p>
          <p><strong>Hora de entrada:</strong> {{ selectedUser.entryTime }}</p>
        </div>
      </div>
    </div>
  </div>
</template>




<script>
import { io } from "socket.io-client";
import { nextTick } from "vue";
import MyMenu from "./ForMenu/MyMenu.vue";

export default {
  components: {MyMenu},
  data() {
    return {
      socket: null,
      message: "",
      messages: [],
      users: [
        { id: 1, name: "Oscar Arias", profession: "Android - Análisis", institution: "SENATI", location: "Independencia", email: "oscar@gmail.com", phone: "997123456", workedHours: "4h 20m", entryTime: "8:00 am" },
        { id: 2, name: "Manuel Echeverria", profession: "Android - Análisis", institution: "SENATI", location: "Independencia", email: "manuel@gmail.com", phone: "997765432", workedHours: "3h 15m", entryTime: "8:15 am" },
        { id: 3, name: "Andrea Santiesteban", profession: "Android - Análisis", institution: "SENATI", location: "Independencia", email: "andrea@gmail.com", phone: "997876543", workedHours: "5h 00m", entryTime: "7:45 am" },
        { id: 4, name: "Marcelo Scerpella", profession: "Android - Análisis", institution: "SENATI", location: "Independencia", email: "marcelo@gmail.com", phone: "997654321", workedHours: "4h 50m", entryTime: "8:10 am" }
      ],
      selectedUser: null,
      searchQuery: "",
      currentUser: { id: 1, name: "Current User" } // Usuario actual para identificar mensajes propios
    };
  },
  computed: {
    filteredUsers() {
      const query = this.searchQuery.toLowerCase();
      return this.users.filter(user => user.name.toLowerCase().includes(query) || user.profession.toLowerCase().includes(query));
    }
  },
  mounted() {
    this.socket = io("http://localhost:3500");

    this.socket.on("connect", () => {
      console.log(`Connected with id: ${this.socket.id}`);
    });

    this.socket.on("chatHistory", (history) => {
      this.messages = history;
      nextTick(() => {
        this.scrollToBottom();
      });
    });

    this.socket.on("message", (data) => {
      this.messages.push(data);
      nextTick(() => {
        this.scrollToBottom();
      });
    });
  },
  methods: {
    selectUser(user) {
      this.selectedUser = user;
    },
    sendMessage() {
      if (this.message.trim()) {
        // Agregar el mensaje al chat localmente
        this.messages.push({
          message: this.message,
          user: this.currentUser.id
        });

        // Enviar el mensaje al servidor
        this.socket.emit("message", {
          message: this.message,
          user: this.currentUser.id
        });

        // Limpiar el campo de texto
        this.message = "";

        // Desplazar hacia abajo el chat
        nextTick(() => {
          this.scrollToBottom();
        });
      }
    },
    scrollToBottom() {
      const container = this.$refs.messageContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }
};
</script>



<style scoped>
/* Contenedor principal con flexbox para distribuir las columnas */
.main-layout {
  display: flex;
  height: 100vh;
}

/* Sidebar (MyMenu) */
.sidebar {
  width: 250px; /* Espacio reservado para la barra lateral */
  background-color: #f5f5f5;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  padding: 20px; /* Agregar padding para que el contenido no esté apretado */
}

/* Ajustes generales para la disposición de las columnas */
.chat-container {
  display: flex;
  flex-grow: 1;
  font-family: Arial, sans-serif;
}

/* Primera columna: Lista de usuarios */
.user-list {
  width: 20%;
  border-right: 1px solid #ccc;
  padding: 10px;
  background-color: #f5f5f5;
}

/* Segunda columna: Sección de chat */
.chat-section {
  width: 50%;
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.messages {
  flex-grow: 1;
  border: 1px solid #ccc;
  padding: 10px;
  height: 100%;
  overflow-y: scroll;
  margin-bottom: 10px;
}

.message-item {
  margin-bottom: 10px;
}

.own-message {
  text-align: right;
  background-color: #d0eaff;
  padding: 5px;
  border-radius: 8px;
  display: inline-block;
}

.other-message {
  text-align: left;
  background-color: #f0f0f0;
  padding: 5px;
  border-radius: 8px;
  display: inline-block;
}

.message-input {
  display: flex;
}

.message-input input {
  flex-grow: 1;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.message-input button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  margin-left: 5px;
  cursor: pointer;
}

/* Tercera columna: Información del usuario */
.user-info {
  width: 30%;
  padding: 20px;
  background-color: #fafafa;
  border-left: 1px solid #ccc;
}

.user-info h2 {
  margin-top: 0;
}
</style>


