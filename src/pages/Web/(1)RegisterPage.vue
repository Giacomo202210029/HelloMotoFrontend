<template>
  <div class="login-container">
    <!-- Sección del logo -->
    <div class="logo-section">
      <img src="/assets/logo.png" alt="Company Logo" class="company-logo" />
    </div>

    <!-- Sección del login -->
    <div class="login-section">
      <div class="login-box">
        <h2>Registro de Administrador</h2>
        <text>Por favor, registrese como administrador </text>
        <button type="mobilebutton" @click="mobilebutton">o rediríjase a la sección de Trabajadores</button>
        <form>
          <FloatLabel class="float">
            <label for="username">Username</label>
            <input type="text" id="username" v-model="username" required />
          </FloatLabel>
          <FloatLabel class="float">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" required />
          </FloatLabel>
          <FloatLabel class="float">
            <label for="phone">Telefono</label>
            <input type="phone" id="phone" v-model="phone" required />
          </FloatLabel>
          <FloatLabel class="float">
            <label for="password">Sede</label>
            <input type="sede" id="sede" v-model="sede" required />
          </FloatLabel>
          <FloatLabel class="float">
            <label for="institution">Institución</label>
            <input type="institution" id="institution" v-model="institution" required />
          </FloatLabel>
          <FloatLabel class="float">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="password" required />
          </FloatLabel>
          <button type="submit" @click="handleLogin">Listo!</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterPage',
  data() {
    return {
      username: '',
      password: '',
      email: '',
      phone: '',
      sede: '',
      institution: ''
    };
  },
  methods: {
    mobilebutton() {
      this.$router.push('/loginmovil')
    },
    handleLogin() {
      // Aquí manejas la lógica del login
      console.log('Username:', this.username);
      console.log('Password:', this.password);
      this.$router.push('controlpanel')
    }
  }
};
</script>

<style scoped>
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
  width: 30rem;
  padding: 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.login-box h2 {
  margin: 0 0 1px 0;
  font-size: 28px;
  text-align: center;
  color: #1a1a1a;
}

.login-box text {
  color: #1a1a1a;
  font-size: 14px;
  display: block;
  text-align: center;
  margin-bottom: 20px;
  width:100%;
}

.login-box label{
  display: block;
  margin-bottom: 5px;
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



.input-group label {
  display: block;
  margin-bottom: 5px;
}

.input-group input {
  width: 100%;
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
</style>
