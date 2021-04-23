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
        //number_string_default: 16, //12, //24 //18
        //number_frets_default: 19, //15, //15 //6

        currentHarpejji: "K24",

        harpejjis: {
            U12: {
                number_string: 12,
                number_frets: 15,
                c1: 2, //note
                c2: 1, //octave over note
                c3: 3, //octave
                c2_2: 1 //demi_decalage
            },
            G16: {
                number_string: 16,
                number_frets: 19,
                c1: 6,
                c2: 3,
                c3: 3,
                c2_2: 1
            },
            K24: {
                number_string: 24,
                number_frets: 15,
                c1: -1,
                c2: 5,
                c3: 1,
                c2_2: 1
            }
        },

        zone: {
            x1: 15,
            y1: 3,
            x2: 22,
            y2: 6
        },

        title: '',
        showNumbers: false,
        showNotes: false,
        showBorder: false,
        playNotes: true,

        selected: [],
        hasBeenModified: false
    },
    getters: {
        getCurrentHarpejji: state => {
            return state.harpejjis[state.currentHarpejji];
        }
    },
    mutations: {
        changeZone(state, newZone) {
            state.zone.x1 = newZone.x1;
            state.zone.x2 = newZone.x2;
            state.zone.y1 = newZone.y1;
            state.zone.y2 = newZone.y2;
        },
        changeTitle(state, newTitle) {
            state.title = newTitle;
        },
        updateShowNumbers(state, showNumbers) {
            state.showNumbers = showNumbers;
        },
        updateShowNotes(state, showNotes) {
            state.showNotes = showNotes;
        },
        updateShowBorder(state, showBorder) {
            state.showBorder = showBorder;
        },
        updatePlayNotes(state, playNotes) {
            state.playNotes = playNotes;
        },
        addToSelection(state, key) {
            state.selected.push(key);
        },
        resetSelection(state) {
            state.selected = [];
        },
        changeHarpejji(state, h) {
            state.currentHarpejji = h;
        },
        hasBeenModified(state, h) {
            state.hasBeenModified = true;
        },
        hasBeenSaved(state) {
            state.hasBeenModified = false;
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