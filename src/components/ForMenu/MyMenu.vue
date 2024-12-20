<script>
import MenuItem from "./MenuItem.vue";
import { ref } from 'vue';
import axios from "axios";
import url from "../../services/url.service.js";

export default {
  components: { MenuItem },
  data() {
    return {
      name: '',
      email: '',
      phone: '',
      area: '',
      model: [
        { label: 'Panel de Control', icon: 'pi pi-fw pi-home', to: '/controlpanel' },
        { label: 'Gestión de trabajadores', icon: 'pi pi-fw pi-users', to: '/members' },
        { label: 'Gestión de Areas', icon: 'pi pi-fw pi-calendar', to: '/addschedule' },
        { label: 'Horarios', icon: 'pi pi-fw pi-clock', to: '/schedule' },
        { label: 'Localizaciones', icon: 'pi pi-fw pi-map-marker', to: '/localizations' },
        { label: 'Mensajes', icon: 'pi pi-fw pi-comments', to: '/chat' },
        { label: 'Reportes de Trabajo', icon: 'pi pi-fw pi-chart-bar', to: '/informes' }
      ],
      adminId:0,
      admin: {
        name: " ",
        areaName: " "
      },
    };
  },
  methods: {
    logout() {
      alert('Has cerrado sesión');
      if(window.UserCredentialsManager)
        window.UserCredentialsManager.removeValue("adminId");
      else
        localStorage.removeItem('adminId');

      this.$router.push('/')
    }
  },
  mounted() {
    let adminId = null
    if(window.UserCredentialsManager)
      adminId = window.UserCredentialsManager.getIntValue("adminId");
    else
      adminId = localStorage.getItem("adminId");

    if (adminId) {
      this.adminId = parseInt(adminId, 10);
    }else{
      this.$router.push('/');  // O la ruta que uses para el login
      return;
    }
    console.log(adminId);

    if (adminId) {
      axios.get(`${url}admin/${adminId}`)
          .then(async (response) => {
            this.admin = response.data;
            console.log(this.admin)

          })
          .catch(error => {
            console.error("Error al obtener la información del administrador", error);
          });
    } else {
      console.error("No hay un administrador conectado.");
    }
  }
};

</script>

<template>
  <ul class="layout-menu">
    <li class="logo-container">
      <img src="/assets/logomenu.png" alt="Company Logo" class="logo" />
    </li>

    <template v-for="(item, i) in model" :key="i">
      <menu-item :item="item" :index="i"></menu-item>
    </template>

    <li class="user-account">
      <div class="user-info">
        <i class="pi pi-user user-icon"></i>
        <div class="user-rolename">
          <text class="user-name">{{admin.name}}</text>
          <text class="user-role">{{admin.area}}</text>
        </div>
        <button class="logout-button" @click="logout">
          <i class="pi pi-sign-out"></i>
        </button>
      </div>
    </li>
  </ul>
</template>


<style scoped>
.user-rolename{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.layout-menu {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 250px;
  background-color: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-bottom: white;
}

.logo {
  max-width: 200px;
  height: auto;
}

.user-account {
  margin-top: auto;
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  background-color: white;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-icon {
  font-size: 1.5rem;
  color: #0071dc;
}

.logout-button {
  background: none;
  border: none;
  color: #0071dc;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.logout-button:hover {
  color: #005bb5;
}
</style>
