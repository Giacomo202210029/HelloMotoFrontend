<script>
import axios from "axios";
import NavBar from "../../components/ForMobile/NavBar.vue";

export default {
  name: "LoginPageMovil",
  components: { NavBar },
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '' // Para mostrar mensajes de error
    };
  },
  methods: {
    async handleLogin() {
      try {
        const loginData = {
          email: this.username,
          password: this.password
        };

        // Realiza la solicitud POST al endpoint /worker/login
        const response = await axios.post('http://localhost:3000/api/v1/worker/login', loginData);

        if (response.status === 200) {
          const worker = response.data.worker;
          // Guardar el ID del trabajador en localStorage
          const userId = response.data.worker.id; // ID del usuario
          localStorage.setItem("userId", userId); // Guardar en localStorage

          // Redirige a la página de control
          this.$router.push('/controlpanelmovil');
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        this.errorMessage = error.response?.data?.message || 'Ocurrió un error al iniciar sesión';
      }
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
      <form @submit.prevent="handleLogin">
        <FloatLabel class="float">
          <label for="username">Correo electrónico</label>
          <input type="email" id="username" v-model="username" required />
        </FloatLabel>
        <FloatLabel class="float">
          <label for="password">Contraseña</label>
          <input type="password" id="password" v-model="password" required />
        </FloatLabel>
        <button type="submit">Iniciar Sesión 👥</button>
      </form>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.logo-image {
  margin-bottom: 30px;
  margin-left: 1rem;
}

.logo-image img {
  max-width: 250px;
  max-height: 250px;
  width: auto;
  height: auto;
}

.Bienvenido {
  font-size: 20px;
  font-weight: bold;
  display: block;
  text-align: center;
  width: 100%;
}

.Entrada {
  font-size: 15px;
  display: block;
  text-align: center;
  width: 100%;
}

.login-container {
  display: flex;
  height: calc(100vh - 60px);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
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
  background-color: white;
  color: #000;
}

.input-group input:focus {
  outline: none;
  border-color: #007bff !important;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #0056b3;
}

.login-box label {
  display: block;
  margin-bottom: 5px;
  margin-top: 10px;
}

.login-box input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  color: #000;
  margin-bottom: 10px;
}

.error-message {
  color: red;
  margin-top: 10px;
  text-align: center;
}
</style>
