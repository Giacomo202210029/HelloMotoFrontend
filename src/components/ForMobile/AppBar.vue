<script>
import { VApp, VAppBar, VBtn, VIcon, VSpacer, VToolbarTitle } from 'vuetify/components';

export default {
  name: "AppBar",
  props: {
    title: {
      type: String,
      required: true
    }
  },
  components: {
    VBtn,
    VIcon,
    VAppBar,
    VSpacer,
    VToolbarTitle,
    VApp
  },
  data() {
    return {
      userId: 0 // Simula el userId obtenido
    };
  },
  methods: {
    menubutton() {
      this.$router.push('/menu');
    }
  }
};
</script>

<template>
  <v-app>
    <v-app-bar class="v-app-bar">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="v-toolbar-title">{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon class="usuario">
        <v-icon large class="v-icon" @click="menubutton">mdi-account-circle</v-icon>
      </v-btn>
    </v-app-bar>
  </v-app>
</template>

<style scoped>
.v-app-bar {
  display: flex;              /* Usar flexbox para el layout */
  justify-content: center;
  align-items: center;
  background-color: white;
  height: 60px; /* Aumentar la altura del AppBar si es necesario */
  position: relative; /* Ensure the v-app-bar is the containing block */
}

.usuario {
  color: black;
  margin-right: 10px; /* Añadir un margen para separar del borde */
}

.v-icon {
  font-size: 30px; /* Ajustar tamaño del ícono */
}

.v-toolbar-title {
  font-size: 23px;
  font-weight: bold;
  position: absolute;
  left: 45%; /* Center the title */
  transform: translateX(-50%);
}
</style>
