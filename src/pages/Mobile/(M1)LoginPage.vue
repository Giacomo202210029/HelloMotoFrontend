<script>
import NavBar from "../../components/ForMobile/NavBar.vue";

export default {
  name: "LoginPageMovil",
  components: {NavBar},
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    handleLogin() {
      // Aquí manejas la lógica del login
      console.log('Username:', this.username);
      console.log('Password:', this.password);
      this.$router.push('controlpanel')
    }
  }
}
</script>

<template>

  <div class="login-container">
        <div class="logo-image">
          <img src="/assets/logomenu.png" alt="logo" />
        </div>
    <div class="login-box">
        <text class="Bienvenido">Bienvenido</text>
        <text class="Entrada">Por favor introduzca su nombre de</text>
        <text class="Entrada">usuario y contraseña</text>
        <form>
          <FloatLabel class="float">
            <label for="username">Username</label>
            <input type="text" id="username" v-model="username" required />
          </FloatLabel>
          <FloatLabel class="float">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="password" required />
          </FloatLabel>
          <button type="submit" @click="handleLogin">Iniciar Sesión 👥</button>
        </form>
      </div>
  </div>
</template>

<style scoped>
.logo-image {
  margin-bottom: 30px;
  margin-left: 1rem;
}

.logo-image img {
  max-width: 250px; /* Adjust this value as needed */
  max-height: 250px; /* Adjust this value as needed */
  width: auto; /* Maintain aspect ratio */
  height: auto; /* Maintain aspect ratio */
}

.Bienvenido{
  font-size: 20px;
  font-weight: bold;
  display: block;
  text-align: center;
  width:100%;
}

.Entrada{
  font-size: 15px;
  display: block;
  text-align: center;
  width:100%;
}

.login-container {
  display: flex;
  height: calc(100vh - 60px); /* Ajusta la altura total menos la altura del NavBar */
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px; /* Espacio entre el contenido y la NavBar */
}


.input-group label {
  display: block;
  margin-bottom: 5px;
}

.input-group input {
  width: 80%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white; /* Fondo blanco */
  color: #000; /* Color del texto negro */
}

.input-group input:focus {
  outline: none;
  border-color: #007bff !Important;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top:10px;
}

button:hover {
  background-color: #0056b3;
}


.login-box label{
  display: block;
  margin-bottom: 5px;
  margin-top: 10px;
}

.login-box input{
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  color: #000;
  margin-bottom: 10px;

}


</style>