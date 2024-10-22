<template>
  <AppBar title="Chat" style="position: fixed" />
  <NavBar style="position: fixed" />
  <div class="chat-container">
    <!-- Sección de chat -->
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
  </div>
</template>

<script>
import { io } from "socket.io-client";
import { nextTick } from "vue";
import NavBar from "../../components/ForMobile/NavBar.vue";
import AppBar from "../../components/ForMobile/AppBar.vue";

export default {
  name: "ChatPage2",
  components: {AppBar, NavBar},
  data() {
    return {
      socket: null,
      message: "",
      messages: [],
      currentUser: { id: 1, name: "Current User" } // Usuario actual para identificar mensajes propios
    };
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
.app-bar {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
}

.nav-bar {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 100;
}

.chat-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px; /* Limitar el ancho para adaptarse mejor a pantallas móviles */
  margin: 5rem 0; /* Ajustar el margen para no superponerse con el AppBar y el NavBar */
  padding: 1rem;
  background-color: white;
  font-family: Arial, sans-serif;
}

.chat-section {
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.messages {
  flex-grow: 1;
  border: 1px solid #ccc;
  padding: 10px;
  height: 40rem; /* Altura fija */
  overflow-y: scroll; /* Habilita el scroll cuando los mensajes exceden el contenedor */
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

</style>
