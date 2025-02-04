<script>
import MyMenu from "../../components/ForMenu/MyMenu.vue";
import axios from "axios";
import { useRoute } from "vue-router";
import url from "../../services/url.service.js";

export default {
  name: "EditMember",
  components: { MyMenu },
  data() {
    return {
      memberId: null,
      name: "",
      email: "",
      phone: "",
      institution: "",
      inputArea: "", // Input para escribir áreas
      areas: [], // List
      // a de áreas disponibles
      selectedAreas: [], // Áreas seleccionadas como etiquetas
      filteredAreas: [], // Áreas filtradas para autocompletado
      loading: true,
      error: null,
    };
  },
  setup() {
    const route = useRoute();
    return { route };
  },
  methods: {
    async loadMemberData() {
      try {
        const memberId = this.route.params.id;
        this.memberId = memberId;

        // Obtener datos del miembro
        const response = await axios.get(`${url}worker/${memberId}`);
        const member = response.data;

        this.name = member.name;
        this.email = member.email;
        this.phone = member.phone;
        this.institution = member.institution;

        // Convertir las áreas preseleccionadas a etiquetas
        if (Array.isArray(member.area)) {
          const areaRequests = member.area.map(async (areaId) => {
            const areaResponse = await axios.get(`${url}area/name/${areaId}`);
            return { id: areaId, name: areaResponse.data.name };
          });
          this.selectedAreas = await Promise.all(areaRequests);
        }
      } catch (error) {
        console.error("Error al cargar los datos del miembro:", error);
        this.error = "Error al cargar los datos del miembro";
      }
    },
    async fetchAreas() {
      try {
        const response = await axios.get(`${url}area/name`);
        this.areas = response.data;
      } catch (error) {
        console.error("Error al cargar las áreas:", error);
      }
    },
    filterAreas() {
      const searchTerm = this.inputArea.toLowerCase();
      this.filteredAreas = this.areas.filter((area) =>
          area.name.toLowerCase().includes(searchTerm)
      );
    },
    selectArea(area) {
      // Añadir área si no está seleccionada
      if (!this.selectedAreas.some((a) => a.id === area.id)) {
        this.selectedAreas.push(area);
      }
      this.inputArea = ""; // Limpiar el input
      this.filteredAreas = []; // Ocultar sugerencias
    },
    removeArea(index) {
      this.selectedAreas.splice(index, 1); // Eliminar área seleccionada
    },
    async submitForm() {
      const updatedMember = {
        name: this.name,
        email: this.email,
        phone: this.phone,
        institution: this.institution,
        area: this.selectedAreas.map((area) => area.id), // Solo IDs de las áreas
      };
      try {
        await axios.put(`${url}workers/${this.memberId}`, updatedMember);
        alert("Miembro actualizado con éxito");
        this.$router.push("/members");
      } catch (error) {
        console.error("Error al actualizar el miembro:", error);
        alert("Error al actualizar el miembro");
      }
    },
  },
  async mounted() {
    await Promise.all([this.loadMemberData(), this.fetchAreas()]);
    this.loading = false;
  },
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
        <!-- Mostrar un mensaje de carga mientras se obtienen los datos -->
        <div v-if="loading">Cargando datos del miembro...</div>

        <!-- Mostrar un mensaje de error si hay un problema -->
        <div v-if="error">{{ error }}</div>

        <!-- Formulario de edición del miembro -->
        <form v-if="!loading && !error" @submit.prevent="submitForm">
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
            <!-- Input para filtrar áreas -->
            <input
                type="text"
                id="area"
                v-model="inputArea"
                @input="filterAreas"
                placeholder="Escriba el nombre del área"
            />

            <!-- Sugerencias de áreas -->
            <ul v-if="filteredAreas.length" class="suggestions">
              <li
                  v-for="area in filteredAreas"
                  :key="area.id"
                  @click="selectArea(area)"
              >
                {{ area.name }}
              </li>
            </ul>

            <!-- Mostrar las áreas seleccionadas como etiquetas -->
            <div class="selected-areas">
    <span
        v-for="(area, index) in selectedAreas"
        :key="area.id"
        class="area-tag"
    >
      {{ area.name }}
      <button
          type="button"
          class="remove-btn"
          @click="removeArea(index)"
      >
        ✕
      </button>
    </span>
            </div>
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
.suggestions {
  border: 1px solid #ddd;
  background-color: white;
  max-height: 150px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin-top: 5px;
}

.suggestions li {
  padding: 10px;
  cursor: pointer;
}

.suggestions li:hover {
  background-color: #f0f0f0;
}

.selected-areas {
  display: flex;
  flex-wrap: wrap;
  margin-top: 5px;
}

.area-tag {
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  padding: 5px 10px;
  margin: 3px;
  display: flex;
  align-items: center;
}

.remove-btn {
  background: none;
  border: none;
  color: white;
  margin-left: 5px;
  cursor: pointer;
}

.main-layout {
  display: flex;
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
