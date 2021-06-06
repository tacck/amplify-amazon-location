import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import '@aws-amplify/ui-vue'
import Amplify from 'aws-amplify'
import awsconfig from './aws-exports'

Amplify.configure(awsconfig)

import 'maplibre-gl/dist/maplibre-gl.css'

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount('#app')
