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
                required
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
      institution: '',
      sede: '',
      areaId: null, // ID del área seleccionada
      selectedArea: "", // Texto ingresado en el campo de área
      areas: [], // Lista completa de áreas
      filteredAreas: [], // Lista filtrada para el autocompletado
      password: '', // Contraseña del usuario
      errorMessage: '' // Mensaje de error si ocurre
    };
  },
  methods: {
    async submitForm() {
      try {
        const scheduleResponse = await axios.get(`http://localhost:3000/api/v1/area/schedule/${this.areaId}`);
        const schedule = scheduleResponse.data.schedule;

        const memberData = {
          name: this.name,
          email: this.email,
          registeredHours: 0,
          status: 3,
          startTime: null,
          breakStart: null,
          phone: this.phone,
          area: this.areaId,
          institution: this.institution,
          sede: this.sede,
          password: this.password,
          latitude: 0,
          longitude: 0,
          schedule: schedule // Usa el horario del área para el trabajador
        };

        console.log('Datos a enviar:', memberData); // Aquí puedes ver lo que estás enviando

        const response = await axios.post('http://localhost:3000/api/v1/data', memberData);

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
        const response = await axios.get("http://localhost:3000/api/v1/area/name");
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
      this.selectedArea = area.name; // Muestra el nombre en el input
      this.areaId = area.id; // Guarda el ID para enviarlo en el submit
      this.filteredAreas = []; // Oculta las sugerencias
    },
    clearForm() {
      this.name = '';
      this.email = '';
      this.phone = '';
      this.selectedArea = '';
      this.institution = '';
      this.sede = '';
      this.areaId = null;
      this.password = '';
      this.errorMessage = '';
    },
    generatePassword() {
      // Genera una contraseña aleatoria
      const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let generatedPassword = "";
      for (let i = 0; i < 8; i++) {
        generatedPassword += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      this.password = generatedPassword; // Asigna la contraseña generada al campo de contraseña
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
