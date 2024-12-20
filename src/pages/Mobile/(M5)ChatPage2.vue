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
import url from "../../services/url.service.js";
import chatUrl from "../../services/chat.service.js";

export default {
  name: "ChatPage2",
  components: { AppBar, NavBar },
  data() {
    return {
      socket: null,
      message: "",
      messages: [],
      currentUser: { id: 1, name: "Current User"}, // Usuario actual
      selectedUserId: null, // Usuario al que se envía el mensaje
    };
  },
  mounted() {
    // Recuperar el userId desde localStorage
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      this.currentUser.id = parseInt(storedUserId, 10); // Asegurarte de convertirlo a un número
      console.log("Usuario actual cargado desde localStorage:", this.currentUser.id);
    } else {
      console.error("No se encontró userId en localStorage.");
      // Opcional: redirigir al login si el usuario no está autenticado
      this.$router.push('/login');
    }

    this.selectedUserId = this.$route.params.userId; // Obtener el ID del usuario seleccionado
    this.socket = io("http://localhost:3500");

    this.socket.on("connect", () => {
      console.log(`Connected with id: ${this.socket.id}`);
    });

    this.socket.on("message", (data) => {
      this.messages.push(data);
      nextTick(() => {
        this.scrollToBottom();
      });
    });

    // Llamar al historial del chat después de que se haya configurado selectedUserId
    this.loadChatHistory();
  },


  methods: {
    async sendMessage() {
      if (this.message.trim()) {
        const payload = {
          from: this.currentUser.id, // Usar el ID del usuario actual desde localStorage
          to: this.selectedUserId,
          message: this.message,
        };

        console.log("Payload enviado:", payload);

        try {
          const response = await axios.post("http://localhost:3000/api/v1/messages", payload);
          console.log("Respuesta del backend (POST /messages):", response.data);

          if (response.data.newMessage) {
            console.log("Mensaje agregado localmente:", response.data.newMessage);
            this.messages.push(response.data.newMessage);
          } else {
            console.warn("El backend no devolvió newMessage");
          }

          this.message = ""; // Limpiar campo de entrada
        } catch (error) {
          console.error("Error al enviar el mensaje:", error.response || error.message);
        }
      }
    },


    async loadChatHistory() {
      try {
        const response = await axios.get(
            `http://localhost:3000/api/v1/messages/${this.currentUser.id}/${this.selectedUserId}`
        );
        console.log("Historial cargado desde el backend:", response.data);
        this.messages = response.data;
      } catch (error) {
        console.error("Error al cargar el historial de chat:", error.response || error.message);
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

  overflow-y: scroll;
}

.message-item {
  display: flex;
  margin-bottom: 10px;
}

.own-message {
  text-align: right;
  background-color: #007bff;
  color: black;
  padding: 10px;
  border-radius: 10px;
  max-width: 60%; /* Ajusta el ancho máximo */
  margin-left: auto; /* Mueve el mensaje al lado derecho */
}

.other-message {
  text-align: left;
  background-color: #f1f1f1;
  color: black;
  padding: 10px;
  border-radius: 10px;
  max-width: 60%; /* Ajusta el ancho máximo */
  margin-right: auto; /* Mueve el mensaje al lado izquierdo */
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
  margin: 5rem 0; /* Ajustar el margen para no superponerse con el AppBar y el NavBar */
  padding: 1rem;
  background-color: white;
  font-family: Arial, sans-serif;

}

.chat-section {
  display: flex;
  flex-direction: column;
  padding: 10px;
  height: calc(100vh - 10rem);
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
