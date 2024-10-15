<script setup>
import { ref } from 'vue';
import MenuItem from "../components/ForMenu/MenuItem.vue";
import MyMenu from "../components/ForMenu/MyMenu.vue";

// Eliminamos el ítem "Panel de Control" y dejamos solo el resto de ítems
const model = ref([
  { label: 'Panel de Control', icon: 'pi pi-fw pi-mobile', to: 'controlpanelday' },
  { label: 'Localizaciones', icon: 'pi pi-fw pi-check-square', to: 'localizations' },
  { label: 'Hojas de horas', icon: 'pi pi-fw pi-mobile', to: 'schedule' },
  { label: 'Personas', icon: 'pi pi-fw pi-table', to: 'members' },
  { label: 'Chat', icon: 'pi pi-fw pi-list', to: 'chat' },
  { label: 'Horarios de trabajo', icon: 'pi pi-fw pi-share-alt', to: 'addschedule' },
  { label: 'Informes', icon: 'pi pi-fw pi-tablet', to: 'informes' }
]);

// Función para manejar el cierre de sesión
function logout() {
  alert('Has cerrado sesión');
}
</script>

<template>
  <MyMenu></MyMenu>
</template>

<style scoped>
/* Estructura general del menú */
.layout-menu {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 250px;
  background-color: white;
  padding: 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

/* Estilo del logo en la parte superior */
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.logo {
  max-width: 150px;
  height: auto;
}

/* Estilos para la sección de cuenta de usuario */
.user-account {
  margin-top: auto; /* Empuja hacia la parte inferior */
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  background-color: #f9f9f9;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-icon {
  font-size: 1.5rem;
  color: #0071dc;
  margin-right: 10px;
}

.user-name {
  font-size: 1rem;
  font-weight: 600;
}

.logout-button {
  background: none;
  border: none;
  color: #0071dc;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
}

.logout-button:hover {
  color: #005bb5;
}

/* Menú separado con línea divisoria */
.menu-separator {
  height: 1px;
  background-color: #e0e0e0;
  margin: 0;
}
</style>
