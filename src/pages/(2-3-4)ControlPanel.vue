<script>
import { ref, onMounted, computed } from 'vue';
import MenuItem from "../components/ForMenu/MenuItem.vue";
import MyMenu from "../components/ForMenu/MyMenu.vue";

export default {
  name: "ControlPanel",
  components: {
    MenuItem,
    MyMenu,
  },
  setup() {
    const chartInstance = ref(null);
    const currentCategory = ref('Day');
    const searchQuery = ref('');
    const currentStatus = ref('Dentro');

    const peopleStatus = ref({
      Dentro: ['Juan', 'Sam', 'Manuel'],
      Descanso: ['Patricia'],
      Fuera: ['Carmen']
    });

    const filteredNames = computed(() => {
      return peopleStatus.value[currentStatus.value].filter(name =>
          name.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    const statusCounts = computed(() => ({
      Dentro: peopleStatus.value.Dentro.length,
      Descanso: peopleStatus.value.Descanso.length,
      Fuera: peopleStatus.value.Fuera.length
    }));

    // ... (rest of the existing code)

    const setStatus = (status) => {
      currentStatus.value = status;
    };

    const filterNames = () => {
      // This function is called when the user presses enter in the search bar
      // The filtering is already handled by the computed property
    };

    const generateRandomData = (count) => {
      return Array.from({ length: count }, () => Math.floor(Math.random() * 8) + 1);
    };

    const chartData = {
      Day: {
        labels: ['Hoy'],
        datasets: [
          {
            label: 'Trabajo',
            data: generateRandomData(1),
            backgroundColor: '#36a2eb',
          },
          {
            label: 'Descanso',
            data: generateRandomData(1),
            backgroundColor: '#ff6384',
          },
          {
            label: 'Horas Extra',
            data: generateRandomData(1),
            backgroundColor: '#ffcd56',
          },
        ],
      },
      Week: {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        datasets: [
          {
            label: 'Trabajo',
            data: generateRandomData(7),
            backgroundColor: '#36a2eb',
          },
          {
            label: 'Descanso',
            data: generateRandomData(7),
            backgroundColor: '#ff6384',
          },
          {
            label: 'Horas Extra',
            data: generateRandomData(7),
            backgroundColor: '#ffcd56',
          },
        ],
      },
      Month: {
        labels: Array.from({ length: 30 }, (_, i) => `Día ${i + 1}`),
        datasets: [
          {
            label: 'Trabajo',
            data: generateRandomData(30),
            backgroundColor: '#36a2eb',
          },
          {
            label: 'Descanso',
            data: generateRandomData(30),
            backgroundColor: '#ff6384',
          },
          {
            label: 'Horas Extra',
            data: generateRandomData(30),
            backgroundColor: '#ffcd56',
          },
        ],
      },
    };

    const updateChart = (category) => {
      const ctx = document.getElementById('barChart');
      if (chartInstance.value) {
        chartInstance.value.destroy();
      }
      chartInstance.value = new Chart(ctx, {
        type: 'bar',
        data: chartData[category],
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              suggestedMax: 10,
            },
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
          },
        },
      });
    };

    const setCategory = (category) => {
      currentCategory.value = category;
      updateChart(category);
    };

    onMounted(() => {
      updateChart('Day');
    });



    return {
      setStatus,
      currentStatus,
      filteredNames,
      statusCounts,
      searchQuery,
      filterNames,
      setCategory,
    };
  },
};


</script>


<template>
  <div class="chat-container">
    <MyMenu></MyMenu>

    <!-- Contenido del dashboard -->
    <div class="dashboard">
      <h1>Control Panel</h1>

      <!-- Botones de selección de categoría en una fila sin tarjeta -->
      <div class="category-buttons">
        <button @click="setCategory('Day')" :class="{ active: currentCategory === 'Day' }">Day</button>
        <button @click="setCategory('Week')" :class="{ active: currentCategory === 'Week' }">Week</button>
        <button @click="setCategory('Month')" :class="{ active: currentCategory === 'Month' }">Month</button>
      </div>

      <!-- Sección de gráficos -->
      <div class="section registered-hours">
        <h2>Registered Hours</h2>
        <canvas id="barChart"></canvas>
      </div>

      <!-- Sección de Localizaciones -->
      <div class="section localizations-container">
        <h2>Localizaciones</h2>
        <img :src="localizationImage" alt="Mapa de Localizaciones" class="localization-image" />
        <button @click="fetchLocalization">Actualizar Localizaciones</button>
      </div>
    </div>

    <!-- Sección a la derecha -->
    <div class="right-sidebar">
      <h2>Información Adicional</h2>

      <!-- Botones para cambiar estados con el mismo estilo -->
      <div class="category-buttons">
        <button @click="setStatus('Dentro')" :class="{ active: currentStatus === 'Dentro' }">
          Dentro ({{ statusCounts.Dentro }})
        </button>
        <button @click="setStatus('Descanso')" :class="{ active: currentStatus === 'Descanso' }">
          Descanso ({{ statusCounts.Descanso }})
        </button>
        <button @click="setStatus('Fuera')" :class="{ active: currentStatus === 'Fuera' }">
          Fuera ({{ statusCounts.Fuera }})
        </button>
      </div>

      <!-- Barra de búsqueda para filtrar nombres -->
      <div class="search-bar">
        <input
            type="text"
            v-model="searchQuery"
            @keyup.enter="filterNames"
            placeholder="Buscar persona..."
        />
      </div>

      <!-- Lista que muestra los nombres filtrados -->
      <div class="names-list">
        <ul>
          <li v-for="(nombre, index) in filteredNames" :key="index">{{ nombre }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos generales */
body, input, button, h1, h2, ul, li, span {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
}

.chat-container {
  display: flex;
  height: 100vh;
}

.layout-menu {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 250px;
  background-color: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.logo {
  max-width: 150px;
  height: auto;
}

.user-account {
  margin-top: auto;
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  background-color: #f9f9f9;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dashboard {
  padding: 20px;
  margin-left: 280px; /* Cambié de 250px a 280px para darle más espacio a la derecha */
  flex-grow: 1;
}

/* Secciones */
.section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Botones del selector de categoría y botones adicionales de la sección derecha */
.category-buttons {
  margin: 20px 0;
}

.category-buttons button {
  margin-right: 10px;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.category-buttons button:hover {
  background-color: #0056b3;
}

.category-buttons button.active {
  background-color: #0056b3;
}

.image-container {
  margin-bottom: 30px;
}

.registered-image {
  max-width: 100%;
  height: auto;
}

.localizations-container {
  margin-top: 30px;
}

.localization-image {
  max-width: 100%;
  height: auto;
}

/* Barra de búsqueda */
.search-bar {
  margin: 20px 0;
}

.search-bar input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

/* Lista de nombres */
.names-list {
  margin-top: 20px;
}

.names-list ul {
  list-style: none;
  padding: 0;
}

.names-list li {
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
}

/* Sección derecha */
.right-sidebar {
  width: 20%;
  padding: 10px;
  background-color: #ffffff;
  border-left: 1px solid #e0e0e0;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}
.registered-hours {
  width: 90%; /* Ajusta el ancho */
  height: 60%; /* Ajusta la altura */
  padding: 20px; /* Ajusta el padding */
}
</style>
