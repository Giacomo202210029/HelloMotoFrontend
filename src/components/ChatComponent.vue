<template>
  <div class="main-container">
    <!-- Sidebar (MyMenu component) -->
    <MyMenu class="MyMenu"/>

    <!-- Chat content -->
    <div class="chat-container">
      <div class="user-list">
        <input type="text" placeholder="Buscar..." v-model="searchQuery" />
        <div v-for="(worker, index) in filteredWorkers" :key="worker.id" class="user-item" @click="selectWorker(worker)">
          <div :class="{'user-selected': selectedWorker?.id === worker.id}">
            <i class="pi pi-user"></i> <!-- ícono del usuario -->
            <span>{{ worker.name }} - {{ worker.profession }}</span>
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

      <!-- Tercera columna: Información del trabajador -->
      <div v-if="selectedWorker" class="user-info">
        <div>
          <h2>{{ selectedWorker.name }} - {{ selectedWorker.profession }}</h2>
          <p><strong>Institución:</strong> {{ selectedWorker.institution }}</p>
          <p><strong>Sede:</strong> {{ selectedWorker.sede }}</p>
          <p><strong>Correo:</strong> {{ selectedWorker.email }}</p>
          <p><strong>Número:</strong> {{ selectedWorker.phone }}</p>
          <p><strong>Horas trabajadas:</strong> {{ selectedWorker.registeredHours.Dentro }}</p>
          <p><strong>Hora de entrada:</strong> {{ selectedWorker.schedule.mon.start }}</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { io } from "socket.io-client";
import { nextTick } from "vue";
import axios from "axios";
import MyMenu from "./ForMenu/MyMenu.vue";

export default {
  components: { MyMenu },
  data() {
    return {
      socket: null,
      message: "",
      messages: [],
      workers: [], // Cambiado de users a workers para reflejar los datos correctos del backend
      selectedWorker: null,
      searchQuery: "",
      currentUser: { id: 1, name: "Current User" } // Usuario actual para identificar mensajes propios
    };
  },
  computed: {
    filteredWorkers() {
      const query = this.searchQuery.toLowerCase();
      return this.workers.filter(worker => worker.name.toLowerCase().includes(query) || worker.profession.toLowerCase().includes(query));
    }
  },
  mounted() {
    this.loadWorkers(); // Cargar los trabajadores cuando el componente se monta

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
    loadWorkers() {
      // Llamada al backend para obtener la lista de trabajadores
      axios.get('http://localhost:3000/api/v1/data')
          .then(response => {
            console.log('Trabajadores obtenidos:', response.data); // Agrega este console.log
            this.workers = response.data;
          })
          .catch(error => {
            console.error("Error al obtener los trabajadores:", error);
          });
    },
  selectWorker(worker) {
      this.selectedWorker = worker;
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

.MyMenu {
  position: relative; /* o puedes usar 'absolute' dependiendo de tu layout */
  z-index: 1; /* Ajusta este valor según sea necesario para asegurarte de que otros elementos no se superpongan */
}

.main-container {
  display: flex;
  height: 100vh;
}

.chat-container {
  display: flex;
  flex-grow: 1;
  height: 100vh;
  font-family: Arial, sans-serif;
}

/* Primera columna: Lista de usuarios */
.user-list {
  width: 20%;
  border-right: 1px solid #ccc;
  padding: 10px;
  background-color: #f5f5f5;
}

.user-item {
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd;
}

.user-item i {
  margin-right: 10px;
}

.user-selected {
  background-color: #e0e0e0;
}

input[type="text"] {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
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
