<template>
    <g :transform="'translate(' + x +', ' + y +')'" id="titleContainer">
        <rect :width="this.$parent.frets_size" height="30" @click.stop="editTitle" style="fill: transparent"></rect>
        <transition name="fade">
            <text :x="this.$parent.frets_size / 2" y="17" alignment-baseline="middle" text-anchor="middle" v-if="!editing" @click.stop="editTitle"
                style="font-family: Helvetica, Arial, sans-serif" :fill="titleT === '' ? '#CCC' : color" :empty="titleT === ''">{{ displayTitle }}</text>
        </transition>
        <transition name="fade">
            <foreignObject height="24" :width="this.$parent.frets_size" v-if="editing" @click.stop y="4">
                <input type="text" id="title" v-model="titleT" @blur.prevent.stop="doneEdit" @keyup.enter="doneEdit" @keydown.stop ref="textEdit" />
            </foreignObject>
        </transition>
    </g>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "Title",
        props: [
            'x',
            'y'
        ],
        data() {
            return {
                titleT: '',
                editing: false,
                color: "#000000"
            }
        },
        methods: {
            /**
             * When the user click on the title to edit him
             */
            editTitle() {
                this.editing = true;
                // To be able to display the keyboard on IOS, we need to focus the element on the click event.
                // We need to create a temporary input, to be able to focus it with the event
                let input = document.createElement("input");
                input.type = "text";
                input.style.opacity = "0";
                document.getElementById('hidden').appendChild(input);
                input.focus();

                // Need to wait for vue.js to update the DOM
                setTimeout(() => {
                    var el = this.$refs.textEdit;
                    el.focus();
                    el.select();
                    el.setSelectionRange(0, 9999); //iOS
                    document.getElementById('hidden').removeChild(input)
                }, 0);
                this.$root.$emit('summonContextual', this);
            },

            /**
             * When the focus of the text field is lost
             */
           doneEdit() {
                this.editing = false;
                this.$store.dispatch('changeTitle', this.titleT);
                this.$root.$emit('unSummonContextual');
            },

            changeColor(color) {
                this.color = color;
            },
            delete() {
                this.titleT = "";
            },
            /**
             * Called by the selector or when the user create a new document
             * @param onlySelected
             */
            resetTitle(onlySelected = false) {
                if (!onlySelected) {
                    this.titleT = "";
                    this.$store.dispatch('changeTitle', this.titleT);
                }
            }
        },
        computed: {
            displayTitle() {
                return this.titleT || "<Click here to add a title>"
            },
            ...mapState(['string_spacing', 'frets_spacing', 'title'])
        },
        watch: {
            title(newTitle) {
                this.titleT = newTitle;
                this.$store.commit('hasBeenModified');
            }
        },
        mounted() {
            this.titleT = this.$store.state.title;
            this.$root.$on('prepareForExportation', this.prepareForExportation);
            this.$root.$on('deleteKeys', this.resetTitle);
        }
    }
</script>

<style scoped>
    input[type="text"] {
        text-align: center;
        display: block;
        height: 24px;
        margin: auto;
        width: 100%;
        font-size: 14px;
    }

    .fade-enter-active {
        animation: fade-animation 0.4s;
    }
    .fade-leave-active {
        animation: fade-animation 0.2s reverse;
    }


    @keyframes fade-animation {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>