<script>
import chatUrl from "../services/chat.service.js";
import url from "../services/url.service.js";

import { nextTick } from "vue";
import axios from "axios";
import MyMenu from "./ForMenu/MyMenu.vue";

export default {
  components: {MyMenu},
  data() {
    return {
      message: "",
      messages: [],
      area: [],
      members: [], // Cambiado de users a workers para reflejar los datos correctos del backend
      selectedWorker: null,
      searchQuery: "",
      currentUser: {id: 56002, name: "Current User"}, // Usuario actual para identificar mensajes propios
      //Reload the chat every 2 seconds
      ticker: setInterval(this.loadChatHistory, 1000)
    };
  },
  computed: {
    filteredWorkers() {
      const query = this.searchQuery.toLowerCase();
      return this.members.filter(worker => worker.name.toLowerCase().includes(query) || worker.profession.toLowerCase().includes(query));
    }
  },
  mounted() {
    this.loadWorkers();
  },
  beforeDestroy() {
    clearInterval(this.ticker);
  },
  methods: {
    async loadWorkers() {
      try {
        const response = await axios.get(`${url}data`);

        this.members = response.data;
        // Mapear los miembros para obtener los nombres de las áreas (procesando arrays)
        const membersWithAreaNames = await Promise.all(
            this.members.map(async (member) => {
              try {
                let areaNames = []; // Almacén de los nombres del área

                // Si el área es un arreglo, iterar sobre cada ID
                if (Array.isArray(member.area)) {
                  const areaRequests = member.area.map(async (areaId) => {
                    try {
                      const areaResponse = await axios.get(`${url}area/name/${areaId}`);
                      return areaResponse.data.name; // Retorna el nombre del área
                    } catch (error) {
                      console.error(`Error al obtener el nombre del área para ID ${areaId}:`, error);
                      return "Área desconocida"; // Valor por defecto en caso de error
                    }
                  });

                  // Esperar a que todas las solicitudes del área se completen
                  areaNames = await Promise.all(areaRequests);
                } else {
                  areaNames = ["Área desconocida"];
                }

                return { ...member, areaNames }; // Agregar nombres del área
              } catch (error) {
                console.error(`Error procesando las áreas del miembro:`, error);
                return { ...member, areaNames: ["Área desconocida"] };
              }
            })
        );

        // Asigna la lista de miembros actualizada al estado
        this.members = membersWithAreaNames;
      } catch (error) {
        console.error("Error al cargar los trabajadores:", error);
      }
    },
    selectWorker(worker) {
      this.selectedWorker = worker;
      this.loadChatHistory(); // Cargar historial al seleccionar un trabajador
    },
    async sendMessage() {
      if (this.message.trim()) {
        const payload = {
          from: this.currentUser.id, // ID del usuario actual
          to: this.selectedWorker.id, // ID del destinatario
          message: this.message
        };

        try {
          const response = await axios.post(`${url}messages`, payload);
          this.message = ""; // Limpiar el campo de entrada
        } catch (error) {
          console.error("Error al enviar el mensaje:", error);
        }
      }
    },
    async loadChatHistory() {
      try {
        if(this.selectedWorker){
          const response = await axios.get(
              `${url}messages/${this.currentUser.id}/${this.selectedWorker.id}`
          );
          this.messages = response.data;
          this.scrollToBottom();
        }
      } catch (error) {
        console.error("Error al cargar el historial de chat:", error);
      }
    },
    scrollToBottom() {
      nextTick(() => {
        const container = this.$refs.messageContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
  },
};
</script>

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
            <span>{{ worker.name }} - {{ worker.areaName }}</span>
          </div>
        </div>
      </div>

      <!-- Segunda columna: Mensajes del chat -->
      <div class="chat-section">
        <div class="messages" ref="messageContainer">
          <div v-for="(message, index) in messages" :key="index" class="message-item">
            <span
                :class="{
                'own-message': message.from === currentUser.id,
                'other-message': message.from !== currentUser.id
              }"
            >
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
          <h2>{{ selectedWorker.name }}</h2>
          <p><strong>Institución:</strong> {{ selectedWorker.institution }}</p>
          <p><strong>Sede:</strong> {{ selectedWorker.sede }}</p>
          <p><strong>Correo:</strong> {{ selectedWorker.email }}</p>
          <p><strong>Número:</strong> {{ selectedWorker.phone }}</p>
          <p><strong>Hora de entrada:</strong> {{ selectedWorker.schedule.mon.start }}</p>
          <p><strong>Hora de salida:</strong> {{ selectedWorker.schedule.mon.end }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-item {
  display: flex;
  justify-content: flex-start; /* Mensajes alineados a la izquierda por defecto */
  margin-bottom: 10px;
}

.own-message {
  align-self: flex-end; /* Mensajes propios alineados a la derecha */
  background-color: #d0eaff;
  color: #000;
  padding: 8px 12px;
  border-radius: 12px;
  max-width: 70%;
  word-wrap: break-word;
  margin-left: auto;
}

.other-message {
  background-color: #f0f0f0;
  color: #000;
  padding: 8px 12px;
  border-radius: 12px;
  max-width: 70%;
  word-wrap: break-word;
}

.MyMenu {
  position: relative;
  z-index: 1;
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
