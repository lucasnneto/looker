import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: "#32A86F",
        error: {
          base: "#890000",
          darken1: "#e90000",
        },
        warn: "#2D9CDB",
        cardBase: { base: "#242731", darken1: "#424242" },
      },
    },
  },
});
