<template>
  <div class="data">
    <div  class="rowData">
      <h3 @click="getData">{{ title }}
        <a v-if="isCollecting || isLoading" class="smallText">waiting...</a>
        <a v-else @click="collectData" class="pointer smallText">collect</a>
      </h3>
    </div>
    <div v-if="!rows.length"> NO DATA </div>
    <v-table :data="rows">
      <thead slot="head">
        <th v-for="header in tableHead" class="tableHead">{{ header }}</th>
      </thead>
      <tbody slot="body" slot-scope="{displayData}">
      <tr v-for="row in displayData" :key="row.id" class="rowData">
        <td v-for="(val, key) in row">{{ key === 'date' ? dateToStr(val) : val }}</td>
      </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script>
export default {
  name: 'Data',
  props: {
    title: String,
    endpoint: String
  },

  data: function () {
    return {
      disconnectMessage: false,
      isLoading: false,
      isCollecting: false,
      rows: []
    }
  },

  beforeDestroy: function () {
  },

  created () {
  },
  mounted () {
    this.getData()
  },

  methods: {
    collectData: function () {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', `http://localhost:8080/${this.endpoint}/collect`, true)
      xhr.send()

      this.isCollecting = true

      xhr.onload = () => {
        if ((xhr.readyState === 4) && (xhr.status === 200)) {
          this.rows = JSON.parse(xhr.responseText)
          this.isCollecting = false
          this.getData()
        }
      }
    },
    getData: function () {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', `http://localhost:8080/${this.endpoint}`, true)
      xhr.send()

      this.rows = []
      this.isLoading = true

      xhr.onload = () => {
        if ((xhr.readyState === 4) && (xhr.status === 200)) {
          this.rows = JSON.parse(xhr.responseText)
          this.isLoading = false
        }
      }
    },
    dateToStr: function(value) {
      return (new Date(value)).toDateString()
    }
  },
  computed: {
    tableHead: function () {
      if (!this.rows.length) return []

      return Object.keys(this.rows[0])
        .map(header => {
          if (!header) return ''
          return header
            .split('_')
            .map(part => part[0].toUpperCase() + part.slice(1))
            .join(' ')
      })
    }
  }
}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
  .rowData {
    text-align: left;
  }
  .smallText {
    font-size: 0.7em;
  }
  .pointer { cursor: pointer; }
  .tableHead { background-color: #eee; }
</style>
