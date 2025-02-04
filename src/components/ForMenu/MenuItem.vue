<script setup>
import { ref, onBeforeMount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useLayout } from "./layout.js";

const route = useRoute();
const { layoutState, setActiveMenuItem, onMenuToggle } = useLayout();

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  index: {
    type: Number,
    default: 0,
  },
  root: {
    type: Boolean,
    default: true,
  },
  parentItemKey: {
    type: String,
    default: null,
  },
});

const isActiveMenu = ref(false);
const itemKey = ref(null);

onBeforeMount(() => {
  itemKey.value = props.parentItemKey ? `${props.parentItemKey}-${props.index}` : String(props.index);
  const activeItem = layoutState.activeMenuItem;
  isActiveMenu.value = activeItem === itemKey.value || activeItem?.startsWith(`${itemKey.value}-`);
});

watch(
    () => layoutState.activeMenuItem,
    (newVal) => {
      isActiveMenu.value = newVal === itemKey.value || newVal?.startsWith(`${itemKey.value}-`);
    }
);

function itemClick(event, item) {
  if (item.disabled) {
    event.preventDefault();
    return;
  }

  if ((item.to || item.url) && (layoutState.staticMenuMobileActive || layoutState.overlayMenuActive)) {
    onMenuToggle();
  }

  if (item.command) {
    item.command({ originalEvent: event, item });
  }

  const foundItemKey = item.items ? (isActiveMenu.value ? props.parentItemKey : itemKey) : itemKey.value;
  setActiveMenuItem(foundItemKey);
}

function checkActiveRoute(item) {
  return route.path === item.to;
}
</script>

<template>
  <li :class="{ 'layout-root-menuitem': root, 'active-menuitem': isActiveMenu }">
    <!-- Si el item tiene una propiedad 'to', usamos router-link -->
    <router-link
        v-if="item.to && !item.items && item.visible !== false"
        @click="itemClick($event, item, index)"
        :class="[item.class, { 'active-route': checkActiveRoute(item) }]"
        tabindex="0"
        :to="item.to"
        class="menu-item"
    >
      <i :class="item.icon" class="layout-menuitem-icon"></i>
      <span class="layout-menuitem-text">{{ item.label }}</span>
    </router-link>

    <!-- Si el item tiene una propiedad 'url', usamos <a> para enlaces externos -->
    <a
        v-else-if="item.url && !item.items && item.visible !== false"
        :href="item.url"
        @click="itemClick($event, item, index)"
        :class="item.class"
        :target="item.target"
        tabindex="0"
        class="menu-item"
    >
      <i :class="item.icon" class="layout-menuitem-icon"></i>
      <span class="layout-menuitem-text">{{ item.label }}</span>
    </a>
  </li>
</template>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

/* Aplicar la fuente Poppins */
body, .menu-item, .layout-menuitem-text {
  font-family: 'Poppins', sans-serif;
}

/* Estilo de la raíz del menú */
.layout-root-menuitem {
  font-weight: 600;
  color: #0071dc;
}

/* Estilo del texto del menú */
.layout-menuitem-text {
  font-size: 1rem;
  font-weight: 400;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background-color: white;
  transition: background-color 0.3s ease, color 0.3s ease;
  color: #333;
  cursor: pointer;
  text-decoration: none;  /* Evitar el subrayado en los enlaces */
}

/* Evitar subrayado en los router-link y <a> */
.menu-item:hover, .menu-item:focus, .menu-item:active {
  text-decoration: none;
}

/* Estilo de hover: Fondo amarillo y texto sin cambiar */
.menu-item:hover {
  background-color: blue; /* Fondo amarillo */
  color: #333;
}

/* Estilo del icono en los items del menú */
.menu-item .layout-menuitem-icon {
  margin-right: 10px;
  font-size: 1.5rem;
  color: #666;  /* Color inicial del icono */
  transition: color 0.3s ease;  /* Transición suave para el cambio de color */
}

/* Cuando el menú está en hover, el icono cambia a azul */
.menu-item:hover .layout-menuitem-icon {
  color: #0071dc; /* Ícono azul en hover */
  transform: scale(1.5); /* Aumentar el tamaño del ícono un 10% */
  transition: transform 0.3s ease, color 0.3s ease; /* Transición suave */
}


/* Estilo de un item activo (por la ruta activa) */
.menu-item.active-route {
  background-color: #005bb5;
  color: white;
}

.menu-item.active-route .layout-menuitem-icon {
  color: white;
}
</style>

