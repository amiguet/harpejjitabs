import Vue from 'vue'
import App from './App.vue'
import store from "./store/params.js"

import { MdDrawer, MdList, MdSwitch, MdDivider, MdMenu, MdDialog } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.use(MdDrawer);
Vue.use(MdList);
Vue.use(MdSwitch);
Vue.use(MdDivider);
Vue.use(MdMenu);
Vue.use(MdDialog);

import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars, faExpand, faFileImage, faFileCode, faFileDownload, faFileUpload, faPlay, faMusic, faPhoneVolume, faVolumeUp, faVolumeMute, faListOl, faSlash, faChevronCircleLeft, faCircle, faChevronCircleRight, faFile, faInfoCircle, faBook} from '@fortawesome/free-solid-svg-icons'
import { faSquare as farSquare, faPlayCircle as farPlayCircle } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './registerServiceWorker'

library.add(faBars, faExpand, faFileImage, faFileCode, faFileDownload, faFileUpload, faPlay, faMusic, faPhoneVolume, faVolumeUp, faVolumeMute, faListOl, faSlash, faChevronCircleLeft, faCircle, faChevronCircleRight, faFile, faInfoCircle, farSquare, farPlayCircle, faBook);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;


new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
