<script>
import { VBtn, VIcon, VBottomNavigation, VApp } from 'vuetify/components';

export default {
  name: 'NavBar',
  components: {
    VBtn,
    VIcon,
    VBottomNavigation,
    VApp,
  },
  methods: {
    chatbutton() {
      this.$router.push('chatpage')
    },
    schedulepagebutton(){
      this.$router.push('schedulepagemobile')
    },
    menubutton(){
      this.$router.push('menu')
    },
    controlpanelbutton(){
      this.$router.push('controlpanelmovil')
    }
  }
}
</script>

<template>
  <v-app>
    <v-bottom-navigation app fixed class="v-bottom-navigation">
      <v-btn icon class="v-btn" @click="controlpanelbutton">
        <v-icon>mdi-home</v-icon>
        <span>Panel de control</span>
      </v-btn>

      <v-btn icon class="v-btn" @click="chatbutton">
        <v-icon>mdi-chat</v-icon>
        <span>Chat</span>
      </v-btn>

      <v-btn icon class="v-btn" @click="schedulepagebutton">
        <v-icon>mdi-clock</v-icon>
        <span>Hojas de horas</span>
      </v-btn>

      <v-btn icon class="v-btn" @click="menubutton">
        <v-icon>mdi-menu</v-icon>
        <span>Menú</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<style scoped>
.v-bottom-navigation {
  background-color: white;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  border-top: 1px solid #e0e0e0;
  border-radius: 15px;
}

v-btn {
  color: #000;
  display: flex;
  flex-direction: column;

}

.v-btn:active {
  transform: scale(0.95);
}

v-icon {
  font-size: 24px;
}

span {
  font-size: 12px;
  letter-spacing: -0.5px;
  word-spacing: -0.5px;
}
</style>
