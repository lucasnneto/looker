<template>
  <v-container>
    <div class="d-flex justify-space-between">
      <div class="d-flex align-center">
        <img width="32" src="@/assets/logo.svg" class="mr-3" />
        <h2 class="poppins font-weight-regular">Looker</h2>
      </div>
      <!-- <div class="d-flex align-center">
        <v-btn class="mr-5" text icon color="white" width="50" height="50">
          <v-icon large>mdi-plus-box-outline</v-icon>
        </v-btn>
        <v-select
          style="width: 275px"
          :items="requests"
          hide-details
          v-model="select"
          item-text="name"
          item-value="name"
          label="Requisição"
          outlined
        ></v-select>
      </div> -->
    </div>
    <div class="d-flex align-center my-12">
      <v-select
        style="max-width: 150px"
        :items="typesRequest"
        hide-details
        v-model="type"
        outlined
      ></v-select>
      <v-text-field
        v-model="url"
        outlined
        label="URL"
        class="mx-9"
        hide-details
      ></v-text-field>
      <v-btn
        height="56"
        color="primary"
        width="100"
        :disabled="disabledSend"
        @click="sendRequest"
        :loading="loading"
        >look</v-btn
      >
    </div>
    <v-row>
      <v-col cols="4">
        <v-card class="pa-6 rounded-lg" color="cardBase" style="height: 250px">
          <p class="font-weight-medium mb-2">Body</p>
          <prism-editor
            v-model="code"
            language="js"
            class="my-editor"
            :class="{ invalid: !isJsonValid }"
            :highlight="highlighter"
            line-numbers
          ></prism-editor>
          <p
            v-if="!isJsonValid"
            class="error--text text--darken-1 text-caption"
          >
            JSON da requisição é inválido!
          </p>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card
          style="height: 250px"
          class="pa-6 rounded-lg d-flex flex-column overflow-hidden"
          color="cardBase"
        >
          <div class="d-flex justify-space-between align-center mb-2">
            <p class="font-weight-medium mb-0">Query</p>
            <v-btn text icon @click="addMethod('querys')">
              <v-icon>mdi-plus-circle-outline</v-icon>
            </v-btn>
          </div>
          <div class="overflow-auto">
            <div
              class="d-flex align-center mb-3"
              v-for="(query, ind) in querys"
              :key="ind"
            >
              <v-text-field
                outlined
                label="Name"
                hide-details
                v-model="query.name"
              ></v-text-field>
              <v-text-field
                outlined
                v-model="query.value"
                label="Value"
                hide-details
                class="mx-2"
              ></v-text-field>

              <v-btn icon text @click="deleteMethod(ind, 'querys')">
                <v-icon>mdi-delete-outline</v-icon>
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card
          style="height: 250px"
          class="pa-6 rounded-lg d-flex flex-column overflow-hidden"
          color="cardBase"
        >
          <div class="d-flex justify-space-between align-center mb-2">
            <p class="font-weight-medium mb-0">Headers</p>
            <v-btn text icon @click="addMethod('headers')">
              <v-icon>mdi-plus-circle-outline</v-icon>
            </v-btn>
          </div>
          <div class="overflow-auto">
            <div
              class="d-flex align-center mb-3"
              v-for="(header, ind) in headers"
              :key="ind"
            >
              <v-text-field
                outlined
                label="Name"
                hide-details
                v-model="header.name"
              ></v-text-field>
              <v-text-field
                outlined
                v-model="header.value"
                label="Value"
                hide-details
                class="mx-2"
              ></v-text-field>

              <v-btn icon text @click="deleteMethod(ind, 'headers')">
                <v-icon>mdi-delete-outline</v-icon>
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-divider class="my-5"></v-divider>
    <v-card
      :disabled="!statusCode"
      class="pa-6 rounded-lg"
      color="cardBase darken-1"
    >
      <div class="d-flex justify-space-between mb-2">
        <p class="font-weight-medium">Preview</p>
        <div class="d-flex">
          <v-chip v-if="duration" label class="mr-4"> {{ duration }} ms</v-chip>
          <v-chip v-if="statusCode" label :color="badgeColor">
            {{ statusCode }}</v-chip
          >
        </div>
      </div>
      <prism-editor
        v-model="response"
        readonly
        language="js"
        class="my-editor"
        :highlight="highlighter"
        line-numbers
      ></prism-editor>
    </v-card>
  </v-container>
</template>

<script>
import { PrismEditor } from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css";

import axios from "axios";
const http = axios.default;
http.interceptors.request.use(
  function (config) {
    config.metadata = { startTime: new Date() };
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
http.interceptors.response.use(
  function (response) {
    response.config.metadata.endTime = new Date();
    response.duration =
      response.config.metadata.endTime - response.config.metadata.startTime;
    return response;
  },
  function (error) {
    error.config.metadata.endTime = new Date();
    error.duration =
      error.config.metadata.endTime - error.config.metadata.startTime;
    return Promise.reject(error);
  }
);
export default {
  name: "HomePage",
  components: {
    PrismEditor,
  },
  data: () => ({
    loading: false,
    select: "Request 1",
    type: "GET",
    url: "https://jsonplaceholder.typicode.com/todos/1",
    code: "{\n\t\n}",
    duration: "",
    statusCode: "",
    response: "",
    querys: [{ name: "", value: "" }],
    headers: [{ name: "", value: "" }],
    typesRequest: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }),
  methods: {
    deleteMethod(index, type) {
      if (type === "querys") this.querys.splice(index, 1);
      else if (type === "headers") this.headers.splice(index, 1);
    },
    addMethod(type) {
      if (type === "querys") this.querys.push({ name: "", value: "" });
      else if (type === "headers") this.headers.push({ name: "", value: "" });
    },
    highlighter(code) {
      return highlight(code, languages.js); // languages.<insert language> to return html with markup
    },
    resetStatus() {
      this.duration = "";
      this.statusCode = "";
      this.response = "";
    },
    async sendRequest() {
      try {
        this.resetStatus();
        this.loading = true;
        const { data, status, duration } = await http.request({
          method: this.type.toLowerCase(),
          url: this.url,
          data: JSON.parse(this.code),
          params: this.querys.reduce((acc, val) => {
            if (!val.name) return acc;
            acc[val.name] = val.value;
            return acc;
          }, {}),
          headers: this.headers.reduce((acc, val) => {
            if (!val.name && !val.value) return acc;
            acc[val.name] = val.value;
            return acc;
          }, {}),
        });
        this.duration = duration;
        this.statusCode = status + " OK";
        this.response = JSON.stringify(data, undefined, 2);
      } catch (error) {
        this.response = this.prettyJ(error.response?.data || "ERROR");
        this.statusCode = error.response?.status || "ERROR";

        this.duration = error.duration;
      } finally {
        this.loading = false;
      }
    },
  },
  computed: {
    badgeColor() {
      if (!this.statusCode) return "";
      if (/^2\d\d/.test(this.statusCode)) return "primary";
      return "error";
    },
    disabledSend() {
      if (!this.isJsonValid || !this.url) return true;
      return false;
    },
    isJsonValid() {
      try {
        JSON.parse(this.code);
      } catch (e) {
        return false;
      }
      return true;
    },
  },
};
</script>
<style lang="scss" scoped>
.poppins {
  font-family: "Poppins", sans-serif;
}
.my-editor {
  height: 175px;
  border: 1px solid rgba(255, 255, 255, 0.42);
  border-radius: 4px;
  color: #ccc;

  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}
.invalid {
  border-color: rgb(233, 0, 0, 0.42);
}
::v-deep .prism-editor__textarea:focus {
  outline: none;
}
::v-deep .vjs-tree__node:hover {
  background-color: transparent;
}
</style>
