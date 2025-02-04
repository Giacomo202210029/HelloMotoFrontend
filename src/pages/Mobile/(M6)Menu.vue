<script>
import axios from 'axios';
import NavBar from "../../components/ForMobile/NavBar.vue";
import AppBar from "../../components/ForMobile/AppBar.vue";
import url from "../../services/url.service.js";

export default {
  name: "MobileMenu",
  components: { AppBar, NavBar },
  props: {
    userId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      worker: null, // Aquí almacenaremos la información del trabajador logueado
    };
  },
  mounted() {
    const workerId = this.userId; // Obtener el ID del trabajador del prop
    if (workerId) {
      // Realizar la solicitud al backend para obtener la información del trabajador logueado
      axios.get(`${url}worker/${workerId}`)
          .then(async (response) => {
            this.worker = response.data; // Almacenar la información del trabajador en el data del componente

            // Si el trabajador tiene un área, obtener el nombre del área
            if (this.worker.area) {
              try {
                const areaResponse = await axios.get(`${url}area/name/${this.worker.area}`);
                this.worker.areaName = areaResponse.data.name; // Agregar el nombre del área
              } catch (error) {
                console.error("Error al obtener el nombre del área:", error);
                this.worker.areaName = "Área desconocida"; // Valor predeterminado en caso de error
              }
            }
          })
          .catch(error => {
            console.error("Error al obtener la información del trabajador", error);
          });
    } else {
      console.error("No hay un trabajador conectado.");
    }
  },

  methods: {
    logout() {
      localStorage.removeItem("userId"); // Elimina el ID del trabajador del almacenamiento local
      this.$router.push('/loginmovil'); // Redirige al usuario a la página de inicio de sesión
    }
  }

};
</script>


<template>
  <AppBar title="Menu" style="position: fixed" />
  <div class="menu-container">
    <div class="profile-section" v-if="worker">
      <i class="pi pi-user user-icon"></i>
      <div class="profile-info">
        <text class="name">{{ worker.name }}</text>
        <text class="role">{{ worker.areaName }}</text>
      </div>
    </div>
    <div class="separator-line"></div>

    <div class="info-section" v-if="worker">
      <div class="info-item">
        <text class="label">Nombre completo</text>
        <text class="info">{{ worker.name }}</text>
      </div>
      <div class="separator-line"></div>
      <div class="info-item">
        <text class="label">Institución</text>
        <text class="info">{{ worker.institution }}</text>
      </div>
      <div class="separator-line"></div>
      <div class="info-item">
        <text class="label">Correo</text>
        <text class="info">{{ worker.email }}</text>
      </div>
      <div class="separator-line"></div>
      <div class="info-item">
        <text class="label">Número</text>
        <text class="info">{{ worker.phone }}</text>
      </div>
    </div>

    <div class="separator-line"></div>

    <div class="logout-section" @click="logout">
      <i class="pi pi-sign-out"></i>
      <text class="logout-text">Cerrar sesión</text>
    </div>

    <div class="separator-line"></div>
  </div>

  <NavBar style="position: fixed" />
</template>


<style scoped>
/* Contenedor general */
.menu-container {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
  margin-top: 4rem; /* Ajustar el margen superior para evitar la AppBar */
}

/* Sección de perfil */
.profile-section {
  margin-top:2rem;
  display: flex;
  align-items: center;
  margin-bottom:1px;
}

.user-icon {
  font-size: 3rem;
  margin-right: 1rem;
  color: #333;
}

.profile-info {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 1.2rem;
  font-weight: bold;
}

.role {
  font-size: 0.875rem;
  color: #888;
}

/* Secciones de información */
.info-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}



.label {
  font-size: 0.875rem;
  font-weight: bold;
  display: block;
}

.info {
  font-size: 0.875rem;
  color: #555;
  display: block;
}

/* Sección de cerrar sesión */
.logout-section {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0.5rem;
}

.logout-section i {
  font-size: 1.5rem;
  margin-right: 0.5rem;
}

.logout-text {
  font-size: 0.875rem;
  font-weight: bold;
}

/* Separador */
.separator-line {
  width: 100%;
  height: 1px;
  background-color: #ccc;
  margin: 8px 0;
}
</style>
