<script>
import MyMenu from "../components/ForMenu/MyMenu.vue";

export default {
  name: 'HojasDeHoras',
  components: { MyMenu },
  data() {
    return {
      searchQuery: '',
      members: [
        {
          name: 'Diego Alonso',
          profession: 'Desarrollador',
          schedule: {
            mon: { start: '9:00am', end: '5:00pm', mode: 'Virtual' },
            tue: { start: '9:00am', end: '5:00pm', mode: 'Presencial' },
            wed: { start: '9:00am', end: '5:00pm', mode: 'Virtual' },
            thu: { start: '9:00am', end: '5:00pm', mode: 'Presencial' },
            fri: { start: '9:00am', end: '5:00pm', mode: 'Virtual' },
            sat: { start: 'Libre', end: '', mode: '' },
            sun: { start: 'Libre', end: '', mode: '' }
          }
        },
        {
          name: 'Manuel Echeverria',
          profession: 'Diseñador',
          schedule: {
            mon: { start: '10:00am', end: '6:00pm', mode: 'Presencial' },
            tue: { start: '10:00am', end: '6:00pm', mode: 'Virtual' },
            wed: { start: '10:00am', end: '6:00pm', mode: 'Presencial' },
            thu: { start: '10:00am', end: '6:00pm', mode: 'Virtual' },
            fri: { start: '10:00am', end: '6:00pm', mode: 'Presencial' },
            sat: { start: 'Libre', end: '', mode: '' },
            sun: { start: 'Libre', end: '', mode: '' }
          }
        },
        {
          name: 'Oscar Arias',
          profession: 'Gerente',
          schedule: {
            mon: { start: '8:00am', end: '4:00pm', mode: 'Presencial' },
            tue: { start: '8:00am', end: '4:00pm', mode: 'Virtual' },
            wed: { start: '8:00am', end: '4:00pm', mode: 'Presencial' },
            thu: { start: '8:00am', end: '4:00pm', mode: 'Virtual' },
            fri: { start: '8:00am', end: '4:00pm', mode: 'Presencial' },
            sat: { start: 'Libre', end: '', mode: '' },
            sun: { start: 'Libre', end: '', mode: '' }
          }
        },
        {
          name: 'Andrea Santiesteban',
          profession: 'Analista',
          schedule: {
            mon: { start: '9:00am', end: '5:00pm', mode: 'Virtual' },
            tue: { start: '9:00am', end: '5:00pm', mode: 'Presencial' },
            wed: { start: '9:00am', end: '5:00pm', mode: 'Virtual' },
            thu: { start: '9:00am', end: '5:00pm', mode: 'Presencial' },
            fri: { start: '9:00am', end: '5:00pm', mode: 'Virtual' },
            sat: { start: 'Libre', end: '', mode: '' },
            sun: { start: 'Libre', end: '', mode: '' }
          }
        },
        {
          name: 'Marcelo Scerpella',
          profession: 'Ingeniero',
          schedule: {
            mon: { start: '10:00am', end: '6:00pm', mode: 'Presencial' },
            tue: { start: '10:00am', end: '6:00pm', mode: 'Virtual' },
            wed: { start: '10:00am', end: '6:00pm', mode: 'Presencial' },
            thu: { start: '10:00am', end: '6:00pm', mode: 'Virtual' },
            fri: { start: '10:00am', end: '6:00pm', mode: 'Presencial' },
            sat: { start: 'Libre', end: '', mode: '' },
            sun: { start: 'Libre', end: '', mode: '' }
          }
        }
      ]
    };
  },
  methods: {
    editSchedule(schedule){
      this.$router.push('schedule/edit')
    },

    addSchedule(){
      this.$router.push('schedule/add')
    }
  }
};
</script>

<template>
  <div class="main-layout">
    <MyMenu></MyMenu>

    <!-- Contenido a la derecha de la barra lateral -->
    <div class="content-area">
      <div class="title-container">
        <h2 style="font-size: 3rem;">Hojas de horas</h2>
      </div>

      <div class="rounded-box">
        <div class="person-list">
          <table>
            <thead>
            <tr>
              <th>
                <input
                    type="text"
                    v-model="searchQuery"
                    placeholder="Buscar personas..."
                    class="search-input"
                />
              </th>
              <th>L</th>
              <th>M</th>
              <th>M</th>
              <th>J</th>
              <th>V</th>
              <th>S</th>
              <th>D</th>
              <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="member in members" :key="member.name">
              <td>
                {{ member.name }}<br />
                <span class="profession">{{ member.profession }}</span>
              </td>
              <td>
                {{ member.schedule.mon.start }}<br />
                {{ member.schedule.mon.end }}<br />
                {{ member.schedule.mon.mode }}
              </td>
              <td>
                {{ member.schedule.tue.start }}<br />
                {{ member.schedule.tue.end }}<br />
                {{ member.schedule.tue.mode }}
              </td>
              <td>
                {{ member.schedule.wed.start }}<br />
                {{ member.schedule.wed.end }}<br />
                {{ member.schedule.wed.mode }}
              </td>
              <td>
                {{ member.schedule.thu.start }}<br />
                {{ member.schedule.thu.end }}<br />
                {{ member.schedule.thu.mode }}
              </td>
              <td>
                {{ member.schedule.fri.start }}<br />
                {{ member.schedule.fri.end }}<br />
                {{ member.schedule.fri.mode }}
              </td>
              <td>
                {{ member.schedule.sat.start }}<br />
                {{ member.schedule.sat.end }}<br />
                {{ member.schedule.sat.mode }}
              </td>
              <td>
                {{ member.schedule.sun.start }}<br />
                {{ member.schedule.sun.end }}<br />
                {{ member.schedule.sun.mode }}
              </td>
              <td>
                <button @click="editSchedule(member)" class="edit-button">Editar</button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

.search-input {
  width: 80%;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.person-list table {
  width: 100%;
  border-collapse: collapse;
}

.person-list th,
.person-list td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.person-list th {
  background-color: #f2f2f2;
}

.person-list tr:hover {
  background-color: #f9f9f9;
}

.edit-button {
  padding: 5px 10px;
  background-color: #ffc107;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-button:hover {
  background-color: #e0a800;
}

.profession {
  font-size: 0.9rem; /* Estilo para la profesión */
  color: #666; /* Color más claro para la profesión */
}
</style>
