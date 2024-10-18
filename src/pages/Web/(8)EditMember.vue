<script>
import { ref } from 'vue';
import MyMenu from "../../components/ForMenu/MyMenu.vue";

export default {
  name: 'EditMember',
  components: {
    MyMenu
  },
  data() {
    return {
      name: '',
      email: '',
      phone: '',
      area: '',
      institution: ''
    };
  },
  methods: {
    submitForm() {
      alert('Miembro actualizado: ' + this.name);
    }
  }
};
</script>

<template>
  <div class="main-layout">
    <MyMenu></MyMenu>
    <div class="content-area">
      <div class="title-container">
        <h2>Editar Miembro</h2>
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
          <button type="submit" class="submit-button">Actualizar</button>
        </form>
      </div>
    </div>
  </div>
</template>


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
</style>
