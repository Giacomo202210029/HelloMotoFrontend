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
            <input
                type="text"
                id="area"
                v-model="selectedArea"
                @input="filterAreas"
                placeholder="Escriba el nombre del área"
            />
            <!-- Lista desplegable de sugerencias -->
            <ul v-if="filteredAreas.length" class="suggestions">
              <li
                  v-for="area in filteredAreas"
                  :key="area.id"
                  @click="selectArea(area)"
              >
                {{ area.name }}
              </li>
            </ul>
            <!-- Mostrar áreas seleccionadas -->
            <div v-if="areasSelected.length" class="selected-areas">
              <span
                  v-for="(area, index) in areasSelected"
                  :key="index"
                  class="selected-area"
              >
                {{ area.name }}
                <button @click="removeArea(index)" class="remove-area">X</button>
              </span>
            </div>
          </div>

          <div class="form-group">
            <label for="institution">Institución</label>
            <input type="text" id="institution" v-model="institution" required />
          </div>
          <div class="form-group">
            <label for="sede">Sede</label>
            <input type="text" id="sede" v-model="sede" required/>
          </div>
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input type="text" id="password" v-model="password" required />
            <button type="button" class="button-password" @click="generatePassword">Generar Contraseña</button>
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
import url from "../../services/url.service.js";
import Checkbox from 'primevue/checkbox';


export default {
  name: 'AddMember',
  components: { MyMenu, Checkbox },
  data() {
    return {
      emailValidator:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]{2,}$/,
      name: '',
      email: '',
      phone: '',
      institution: '',
      sede: '',
      areasSelected: [], // Lista de áreas seleccionadas
      selectedArea: "", // Entrada del input de área
      areas: [], // Lista completa de áreas
      filteredAreas: [], // Áreas filtradas para sugerencias
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    creationError(detail){
      const errorOnUserCreation = "Error al registrar el miembro"
      return this.$toast.add({severity: 'error', life: 5000, detail, summary: errorOnUserCreation})
    },
    async submitForm() {
      try {
        // Obtener el horario de la primera área seleccionada
        let schedule = null;

        if (this.areasSelected.length > 0) {
          const response = await axios.get(`${url}area/schedule/${this.areasSelected[0].id}`);
          schedule = response.data.schedule;
        }

        if(!this.name) return this.creationError('El nombre esta vacio')
        if(!this.email) return this.creationError('El correo esta vacio')
        if(!this.emailValidator.test(this.email)) return this.creationError('El correo no es valido')
        if(!this.phone) return this.creationError('El telefono esta vacio')
        if(this.phone.length < 9 || isNaN(parseInt(this.phone.replace(/[\s+]/g, ''))) )
          return this.creationError('El telefono no es valido')
        if(!this.areasSelected || !this.areasSelected.length) return this.creationError('El usuario no tiene un area asignada')
        if(!this.institution) return this.creationError('El usuario no tiene una institucion asignada')
        if(!this.sede) return this.creationError('El usuario no tiene una sede asignada')
        if(!this.password) return this.creationError('El usuario no tiene una contraseña')

        // Datos a enviar
        const memberData = {
          name: this.name,
          email: this.email,
          registeredHours: 0,
          status: 3,
          startTime: null,
          breakStart: null,
          phone: this.phone,
          area: this.areasSelected.map((area) => area.id), // IDs de las áreas seleccionadas
          institution: this.institution,
          sede: this.sede,
          password: this.password,
          latitude: 0,
          longitude: 0,
          schedule: schedule, // Solo el horario de la primera área
        };

        console.log('Datos a enviar:', memberData);

        const response = await axios.post(`${url}data`, memberData);
        if (response.status === 201 || response.status === 200) {
          alert('Miembro añadido correctamente: ' + this.name);
          this.$router.push({ name: 'MembersPage' });
        }
      } catch (error) {
        console.error('Error al añadir el miembro:', error);
        this.errorMessage = 'Ocurrió un error al añadir el miembro.';
      }
    },
    async fetchAreas() {
      try {
        const response = await axios.get(`${url}area/name`);
        this.areas = response.data;
      } catch (error) {
        console.error("Error al obtener las áreas:", error);
        this.errorMessage = 'Error al cargar las áreas.';
      }
    },
    filterAreas() {
      const searchTerm = this.selectedArea.toLowerCase();
      this.filteredAreas = this.areas.filter((area) =>
          area.name.toLowerCase().includes(searchTerm)
      );
    },
    selectArea(area) {
      if (!this.areasSelected.find((a) => a.id === area.id)) {
        this.areasSelected.push(area); // Añadir el área seleccionada
      }
      this.selectedArea = ""; // Limpiar el input
      this.filteredAreas = []; // Ocultar sugerencias
    },
    removeArea(index) {
      this.areasSelected.splice(index, 1); // Eliminar área seleccionada
    },
    generatePassword() {
      const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
      let generatedPassword = "";
      for (let i = 0; i < 12; i++) {
        generatedPassword += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      this.password = generatedPassword;
    }
  },
  async mounted() {
    await this.fetchAreas();
  }
};

</script>

<style scoped>

.suggestions {
  border: 1px solid #ddd;
  background-color: white;
  max-height: 150px;
  overflow-y: auto;
  margin-top: 5px;
  list-style-type: none;
  padding: 0;
}

.selected-areas {
  margin-top: 10px;
}

.selected-area {
  display: inline-block;
  background-color: #0071dc;
  color: white;
  padding: 5px 10px;
  margin-right: 5px;
  border-radius: 4px;
}

.remove-area {
  background: none;
  border: none;
  color: white;
  margin-left: 5px;
  cursor: pointer;
  font-weight: bold;
}

.remove-area:hover {
  color: #ff6347; /* Color rojo al pasar el cursor */
}


.suggestions li {
  padding: 10px;
  cursor: pointer;
}

.suggestions li:hover {
  background-color: #f0f0f0;
}

/* Estilos ya definidos */
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

.suggestions {
  border: 1px solid #ddd;
  background-color: white;
  max-height: 150px;
  overflow-y: auto;
  margin-top: 5px;
  list-style-type: none;
  padding: 0;
}

.suggestions li {
  padding: 10px;
  cursor: pointer;
}

.suggestions li:hover {
  background-color: #f0f0f0;
}

/* Estilos ya definidos */
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

.button-password{
  color: blue;
}

</style>
