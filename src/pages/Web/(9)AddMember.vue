<template>
  <div class="main-layout">
    <MyMenu></MyMenu>
    <div class="content-area">
      <div class="title-container">
        <h2>Añadir Miembro</h2>
      </div>

      <div class="rounded-box">
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="name">Nombre</label>
            <input type="text" id="name" v-model="name" required />
          </div>
          <div class="form-group">
            <label for="email">Correo</label>
            <input type="email" id="email" v-model="email" required />
          </div>
          <div class="form-group">
            <label for="phone">Teléfono</label>
            <input type="text" id="phone" v-model="phone" required />
          </div>
          <div class="form-group">
            <label for="area">Área</label>
            <input type="text" id="area" v-model="area" required />
          </div>
          <div class="form-group">
            <label for="institution">Institución</label>
            <input type="text" id="institution" v-model="institution" required />
          </div>
          <button type="submit" class="submit-button">Guardar</button>
        </form>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import MyMenu from "../../components/ForMenu/MyMenu.vue";

export default {
  name: 'AddMember',
  components: {
    MyMenu
  },
  data() {
    return {
      name: '',
      email: '',
      phone: '',
      area: '',
      institution: '',
      errorMessage: '' // Para mostrar errores si ocurren
    };
  },
  methods: {
    async submitForm() {
      try {
        const memberData = {
          name: this.name,
          email: this.email,
          phone: this.phone,
          area: this.area,
          institution: this.institution
        };

        // Realiza la solicitud POST al backend
        const response = await axios.post('http://localhost:3000/api/v1/data', memberData);

        if (response.status === 201 || response.status === 200) {
          alert('Miembro añadido correctamente: ' + this.name);
          this.clearForm(); // Limpia el formulario si se añade con éxito
        }

      } catch (error) {
        console.error('Error al añadir el miembro:', error);
        this.errorMessage = 'Ocurrió un error al añadir el miembro.';
      }
    },
    clearForm() {
      // Limpia los campos del formulario
      this.name = '';
      this.email = '';
      this.phone = '';
      this.area = '';
      this.institution = '';
      this.errorMessage = ''; // Limpiar el mensaje de error si lo hay
    }
  }
};
</script>

<style scoped>
/* Estilos similares a Users.vue */
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  margin: 0;
}

.rounded-box {
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.submit-button {
  padding: 10px 20px;
  background-color: #0071dc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #005bb5;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>
