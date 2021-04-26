<template>
    <transition name="fade">
        <g v-if="isVisible">
            <circle r="10" cy="20" fill="transparent" stroke="#00B0FF" opacity="1">
                <animate attributeName="r" values="12;20" dur="1s" begin="indefinite" :id="'anim' + note"></animate>
                <animate attributeName="opacity" values="1;0" dur="1s" :begin="'anim' + note + '.begin'"></animate>
            </circle>
            <path :d="path" :fill="color" @click.stop="startEdit"></path>
            <ellipse rx="22" ry="1" opacity="0"></ellipse>
            <text y="21" style="fill: white; font-size: 16px;font-family: Helvetica, Arial, sans-serif;"
                  text-anchor="middle" dominant-baseline="middle" @click.stop="startEdit">{{ value }}
            </text>
            <path :d="path" v-if="isSelected" fill="rgba(240, 240, 240, 0.5)" @mousedown.stop="startMoving" @touchstart.stop="startMoving" style="cursor: grab"></path>
            <transition name="fade">
                <foreignObject height="24" width="24" x="-12" :y="-12 + 20" v-if="editing" @click.stop="" ref="fo">
                    <input type="text" v-model="value" @blur.prevent.stop="doneEdit" @keyup.enter="doneEdit"
                           @keydown.delete="deleteDown" @keydown.stop ref="textEdit"/>
                </foreignObject>
            </transition>
        </g>
    </transition>
</template>

<script>


    export default {
        name: "Finger",
        props: [
            'isVisible',
            'note'
        ],
        data() {
            return {
                value: '1',
                color: '#000000',
                editing: false,
                isSelected: false,
                hand: 0,
            }
        },
        methods: {
            /**
             * When the user click on a mark, a textfield appears to allow modification
             */
            startEdit() {
                if (this.$store.state.isFreeMode) {
                    this.$parent.playNote();
                    return;
                }
                this.editing = true;
                // To be able to display the keyboard on IOS, we need to focus the element on the click event.
                // We need to create a temporary input, to be able to focus it with the event
                let input = document.createElement("input");
                input.type = "text";
                input.style.opacity = "0";
                document.getElementById('hidden').appendChild(input);
                input.focus();

                // It need to be in the next "thread".
                // Because we need to wait for Vue.js to update the DOM
                setTimeout(() => {
                    var el = this.$refs.textEdit;
                    el.focus();
                    el.select();
                    el.setSelectionRange(0, 9999); //iOS
                    document.getElementById('hidden').removeChild(input);

                    // Summon the contextual menu
                    this.$root.$emit('summonContextual', this);
                }, 0);

            },
            /**
             * When the text field focus is lost..
             */
            doneEdit() {
                this.editing = false;
            },

            /**
             *  When the delete key is down, might want to delete the finger if the value is already empty
             */
            deleteDown() {
                if (this.value === "") {
                    this.delete()
                }
            },
            /**
             * When a Finger is deleted, call the parent function deleteFinger
             */
            delete() {
                this.$emit('deleteFinger');
            },
            changeColor(color) {
                this.color = color;
            },
            changeHand(hand) {
                this.hand = hand;
            },
            // Event listener when the user begin to drag a selected finger
            startMoving(e) {
                this.$root.$emit('startMoving', e);
            }
        },
        computed: {
            // Path of the SVG shape of the finger
            path() {
                if (this.hand === 0) {
                    //circle   x  y              2r               -2r
                    return "m -12 20 a 1 1 0 0 1 24 0 a 1 1 0 0 1 -24 0";
                } else if (this.hand === -1) {
                    // Used this application https://mavo.io/demos/svgpath
                    // To generate the path
                    return "m -11 15 a 1 1 1 0 1 22 10 q -4 8 -27 10 q 2 -7 5 -20 z "
                } else if (this.hand === 1) {
                    return "m 11 15 a 1 1 1 0 0 -22 10 q 4 8 27 10 q -2 -7 -5 -20 z"
                }
                return 0;
            },
            /**
             * Little hack to watch() multiple function at once
             * When one of the 3 property will change, it will call the allProperty in the watch function
             * @returns {string}
             */
            allProperty() {
                return `${this.hand}|${this.color}|${this.value}`;
            }
        },
        watch: {
            /**
             * When the user stop the editing of a Finger, unsummon the contextual menu
             */
            editing(newValue) {
                if (!newValue) {
                    this.$root.$emit('unSummonContextual');
                }
            },
            /**
             * When a property of the finger change
             * Indicate it has been modified
             */
            allProperty() {
                // Indicate that the tablature has been modified.
                // A warning will appear if the user try to create a new tablature without saving first
                this.$store.commit('hasBeenModified');
            }
        },
    }
</script>

<style scoped>
    input[type=text] {
        width: 24px;
        height: 24px;
        /*margin: 4px auto;*/
        padding: 0;
        border-radius: 100%;
        text-align: center;
        font-family: Helvetica, Arial, sans-serif;
        background: aliceblue;
        outline: none;
        border: 2px solid #015ECC;
    }

    .fade-enter-active {
        animation: fade-animation 0.2s;
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