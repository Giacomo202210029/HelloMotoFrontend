<template>
  <div class="login-container">
    <!-- Sección del logo -->
    <div class="logo-section">
      <img src="/assets/logo.png" alt="Company Logo" class="company-logo" />
    </div>

    <!-- Sección del login -->
    <div class="login-section">
      <div class="login-box">
        <h2>Login</h2>
        <p class="demo-message">
          ⚠️ Este es un <strong>demo</strong>. Puedes iniciar sesión con:
          <br /><br />
          <strong>Administrador:</strong> <code>demo</code> / <code>demo</code><br />
          <strong>Trabajador:</strong> <code>giacomogazr@gmail.com</code> / <code>contraseñasupersecreta</code>
        </p>

        <form>
          <FloatLabel class="float">
            <label for="username">Username</label>
            <input type="text" id="username" v-model="username" required />
          </FloatLabel>
          <FloatLabel class="float">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="password" required />
          </FloatLabel>
          <button class="buttonenvio" type="submit" @click="handleLogin">Iniciar Sesión 👥</button>
          <button class="mobilebutton" @click="mobilebutton">Colaboradores 👷</button>
        </form>

        <!-- Botones adicionales -->
        <div class="extra-links">
          <a href="https://github.com/Giacomo202210029/HelloMotoFrontend.git" target="_blank" class="github-link">Ver código en GitHub</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import url from "../../services/url.service.js";

export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    mobilebutton() {
      this.$router.push('/loginmovil');
    },
    async handleLogin(event) {
      event.preventDefault();
      try {
        const response = await axios.post(`${url}login`, {
          username: this.username,
          password: this.password
        });

        if (response.status === 200) {
          const adminId = response.data.adminId;
          if (adminId) {
            if (window.UserCredentialsManager)
              window.UserCredentialsManager.setIntValue("adminId", adminId);
            else
              localStorage.setItem("adminId", adminId);
          }
          alert(response.data.message);
          this.$router.push('controlpanel');
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert('Nombre de usuario o contraseña incorrectos');
        } else {
          alert('Error en el inicio de sesión. Inténtelo de nuevo más tarde');
        }
      }
    }
  }
};
</script>

<style scoped>
.buttonenvio {
  margin-top: 1rem;
  background-color: #0f83fd;
}
.float {
  color: #1a1a1a;
}

.login-container {
  display: flex;
  height: 100vh;
}

.logo-section {
  width: 60vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0071dc;
}

.company-logo {
  max-width: 80%;
  max-height: 80%;
  object-fit: contain;
}

.login-section {
  width: 50vw;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-box {
  width: 20rem;
  padding: 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.login-box h2 {
  font-size: 28px;
  color: #1a1a1a;
}

.demo-message {
  color: #ff5e00;
  font-size: 14px;
  margin-bottom: 20px;
  background: #fff3e0;
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
}

.login-box label {
  display: block;
  margin-bottom: 5px;
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

.input-group label {
  display: block;
  margin-bottom: 5px;
}

.input-group input {
  width: 100%;
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

/* Enlace a GitHub */
.extra-links {
  margin-top: 15px;
}

.github-link {
  display: inline-block;
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
  font-size: 14px;
}

.github-link:hover {
  text-decoration: underline;
}
</style>
