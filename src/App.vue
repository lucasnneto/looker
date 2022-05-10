<template>
  <v-app dark>
    <v-main>
      <home />
    </v-main>
  </v-app>
</template>

<script>
import home from "./components/home";

export default {
  name: "App",

  components: {
    home,
  },

  data: () => ({
    //
  }),
};
</script>
<style lang="scss">
.theme--dark.v-application {
  background: #1a1a1a;
}
</style>
