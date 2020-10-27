import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        frets_spacing: 60,
        string_spacing: 30,
        padding: 20,
        marker_width: 15,
        marker_height: 25,
        text_height: 20,
        number_string_default: 24, //24 //18
        number_frets_default: 15, //15 //6

        zone: {
            x1: 4,
            y1: 1,
            x2: 10,
            y2: 4
        },

        title: 'Am7b5'
    },
    getters: {},
    mutations: {
        changeZone(state, newZone) {
            state.zone.x1 = newZone.x1;
            state.zone.x2 = newZone.x2;
            state.zone.y1 = newZone.y1;
            state.zone.y2 = newZone.y2;
        },
        changeTitle(state, newTitle) {
            state.title = newTitle;
        }
    },
    actions: {
        changeZone(context, newZone) {
            context.commit('changeZone', newZone);
        },
        changeTitle(context, newTitle) {
            context.commit('changeTitle', newTitle);
        }
    }
});