<template>
  <AppBar title="Chat" style="position: fixed" />
  <NavBar style="position: fixed" />
  <div class="chat-container">
    <div class="chat-section">
      <div class="messages" ref="messageContainer">
        <div
            v-for="(message, index) in messages"
            :key="index"
            class="message-item"
        >
          <span
              :class="{
              'own-message': message.from === currentUser.id,
              'other-message': message.from !== currentUser.id,
            }"
          >
            {{ message.message }}
          </span>
        </div>
      </div>
      <div class="message-input">
        <input
            v-model="message"
            placeholder="Escriba un mensaje..."
            @keyup.enter="sendMessage"
        />
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
import AppBar from "../../components/ForMobile/AppBar.vue";
import NavBar from "../../components/ForMobile/NavBar.vue";
import axios from "axios";

export default {
  name: "ChatPage2",
  components: { AppBar, NavBar },
  data() {
    return {
      socket: null,
      message: "",
      messages: [],
      currentUser: { id: 1 }, // Usuario actual
      selectedUserId: null, // Usuario al que se envía el mensaje
    };
  },
  mounted() {
    this.selectedUserId = this.$route.params.userId; // Obtener el ID del usuario seleccionado
    this.socket = io("http://localhost:3500");

    this.socket.emit("joinRoom", { userId: this.currentUser.id });

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
        const newMessage = {
          from: this.currentUser.id,
          to: this.selectedUserId,
          message: this.message,
        };

        // Enviar el mensaje al servidor
        this.socket.emit("privateMessage", newMessage);

        // Agregar el mensaje localmente
        this.messages.push(newMessage);

        this.message = "";
        nextTick(() => {
          this.scrollToBottom();
        });
      }
    },
    async loadChatHistory() {
      try {
        const response = await axios.get(
            `http://localhost:3000/api/v1/messages/${this.currentUser.id}/${this.selectedWorker.id}`
        );
        this.messages = response.data;
      } catch (error) {
        console.error("Error al cargar el historial de chat:", error);
      }
    },
    scrollToBottom() {
      const container = this.$refs.messageContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
  },
};
</script>


<style scoped>
.messages {
  height: calc(100vh - 10rem);
  overflow-y: scroll;
}

.own-message {
  text-align: right;
  background-color: #007bff;
  color: white;
  padding: 10px;
  border-radius: 10px;
  max-width: 80%;
  margin-left: auto;
  margin-bottom: 10px;
}

.other-message {
  text-align: left;
  background-color: #f1f1f1;
  color: black;
  padding: 10px;
  border-radius: 10px;
  max-width: 80%;
  margin-right: auto;
  margin-bottom: 10px;
}

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
