<script>
import MyMenu from "../../components/ForMenu/MyMenu.vue";

export default {
  name: 'MembersPage',
  components: {
    MyMenu
  },
  data() {
    return {
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
    addMember() {
      this.$router.push('addmember');
    },
    // Método para manejar el chat
    // chatWith(member) {
    //   this.$router.push(`/chat/${member.name}`);
    // }
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
        <h2 style="font-size: 3rem;">Localizaciones</h2>
      </div>

      <div class="rounded-box">
        <div class="map-container">
          <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1950.9605290581515!2d-77.05666841787476!3d-12.048952454234078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c929e48dc06d%3A0x402bdfd279035247!2sJir%C3%B3n%20Zorritos%201348%2C%20Lima%2015082!5e0!3m2!1ses!2spe!4v1729003961226!5m2!1ses!2spe"
              style="border:0; width: 100%; height: 400px;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        </div>

        <div class="people-list">
          <div class="person-card" v-for="(member, index) in members" :key="index">
            <div class="person-header">
              <i class="pi pi-user user-icon"></i>
              <div class="name-email-container">
                <h4>{{ member.name }}</h4>
                <p class="email">{{ member.email }}</p>
              </div>
            </div>
            <p class="info">Teléfono: {{ member.phone }}</p>
            <p class="info">Área: {{ member.area }}</p>
            <p class="info">Institución: {{ member.institution }}</p>
            <button class="chat-button" @click="chatWith(member)">
              <i class="pi pi-comments"></i> Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  margin-bottom: 20px;
}

.map-container {
  margin-bottom: 20px; /* Margen alrededor del mapa */
}

.people-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 columnas */
  gap: 20px; /* Espacio entre tarjetas */
}

.person-card {
  border: 1px solid #e0e0e0;
  padding: 15px;
  border-radius: 8px;
  text-align: left; /* Justificado a la izquierda */
}

.person-header {
  display: flex;
  align-items: flex-start; /* Alineación a la parte superior */
  justify-content: flex-start; /* Alineación a la izquierda */
}

.user-icon {
  margin-right: 5px; /* Espacio reducido entre el icono y el nombre */
  font-size: 2rem; /* Aumenta el tamaño del ícono */
  color: #0071dc; /* Color del ícono */
}

.name-email-container {
  display: flex;
  flex-direction: column; /* Coloca nombre y correo en columna */
}

.email {
  font-size: 0.8rem; /* Tamaño de letra más pequeño */
  color: #555; /* Color gris para el correo */
  margin: 0; /* Sin margen */
  line-height: 1; /* Sin interlineado */
}

.info {
  margin: 5px 0; /* Espacio entre líneas de información */
}

.chat-button {
  padding: 5px 10px;
  border: 2px solid #0071dc; /* Borde azul */
  background-color: white; /* Fondo blanco */
  color: #0071dc; /* Texto azul */
  border-radius: 20px; /* Bordes redondeados */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.chat-button:hover {
  background-color: #0071dc; /* Fondo azul al pasar el mouse */
  color: white; /* Texto blanco al pasar el mouse */
}

.chat-button i {
  margin-right: 5px; /* Espacio entre ícono y texto */
}
</style>
