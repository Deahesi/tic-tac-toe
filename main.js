import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import Firebase from "firebase/app"
import store from './store'
import Vuelidate from "vuelidate"
import messPlugin from './utils/message.plugin'
import Loader from './components/Loader'

Vue.config.productionTip = false

Vue.use(Vuelidate)
Vue.use(messPlugin)
Vue.component('Loader', Loader)

Firebase.initializeApp({
  apiKey: "AIzaSyDA5rxjRmvFsZAFaNesTcN6IiaLqXiG6B4",
  authDomain: "seafortress-f.firebaseapp.com",
  databaseURL: "https://seafortress-f.firebaseio.com",
  projectId: "seafortress-f",
  storageBucket: "seafortress-f.appspot.com",
  messagingSenderId: "60944459931",
  appId: "1:60944459931:web:f1ce2a6877f2aa304c3e3e",
  measurementId: "G-SGK693K1YY"
})

let app

Firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})
