<script>
import MyMenu from "../../components/ForMenu/MyMenu.vue";
import ChatComponent from "../../components/ChatComponent.vue";

export default {
  name: "(11)ChatPage",
  components: {ChatComponent, MyMenu, }
}
</script>

<template>
<MyMenu></MyMenu>
  <ChatComponent user="giacomo"></ChatComponent>
</template>

<style scoped>

</style>