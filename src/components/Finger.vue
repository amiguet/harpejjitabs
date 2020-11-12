<template>
    <transition name="fade">
        <g v-if="isVisible">
            <circle r="10" cy="20" fill="transparent" stroke="#00B0FF" opacity="1">
                <animate attributeName="r" values="12;20" dur="1s" begin="indefinite" :id="'anim' + note"></animate>
                <animate attributeName="opacity" values="1;0" dur="1s" :begin="'anim' + note + '.begin'"></animate>
            </circle>
            <!--<circle r="12" cy="20" :fill="color" @click.stop="startEdit"></circle>-->
            <!--<circle v-if="isSelected" r="12" cy="20" fill="rgba(240, 240, 240, 0.5)" @click.stop="startEdit"></circle>-->
            <path :d="path" :fill="color" @click.stop="startEdit"></path>
            <path :d="path" v-if="isSelected" fill="rgba(240, 240, 240, 0.5)" @click.stop="startEdit"></path>
            <ellipse rx="22" ry="1" opacity="0"></ellipse>
            <text y="21" style="fill: white; font-size: 16px;font-family: Helvetica, Arial, sans-serif;"
                  text-anchor="middle" dominant-baseline="middle" @click.stop="startEdit">{{ value }}
            </text>
            <transition name="fade">
                <foreignObject height="24" width="24" x="-12" :y="-12 + 20" v-if="editing" @click.stop="" ref="fo">
                    <input type="text" v-model="value" @blur.prevent.stop="doneEdit" @keyup.enter="doneEdit"
                           @keydown.delete="deleteDown" ref="textEdit"/>
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
                animate: true,
                isSelected: false,
                hand: 0,
            }
        },
        methods: {
            startEdit() {
                this.editing = true;
                // To be able to display the keyboard on IOS, we need to focus the element on the click event.
                // We need to create a temporary input, to be able to focus it with the event
                let input = document.createElement("input");
                input.type = "text";
                input.style.opacity = "0";
                document.getElementById('hidden').appendChild(input);
                input.focus();

                setTimeout(() => {
                    var el = this.$refs.textEdit;
                    el.focus();
                    el.select();
                    el.setSelectionRange(0, 9999); //iOS
                    document.getElementById('hidden').removeChild(input);

                    this.$root.$emit('summonContextual', this);
                }, 0);

            },
            doneEdit() {
                this.editing = false;
            },

            /* When the delete key is down, might want to delete the finger if the value is already empty */
            deleteDown() {
                if (this.value === "") {
                    this.delete()
                }
            },
            delete() {
                this.$emit('deleteFinger');
            },
            changeColor(color) {
                this.color = color;
            },
            changeHand(hand) {
                this.hand = hand;
            }
        },
        computed: {

            animationName() {
                return this.animate ? "fade" : "disable";
            },
            path() {
                if (this.hand === 0) {
                    //circle   x  y              2r               -2r
                    return "m -12 20 a 1 1 0 0 1 24 0 a 1 1 0 0 1 -24 0";
                } else if (this.hand === -1) {
                    return "m -11 15 a 1 1 1 0 1 22 10 q -4 8 -32 10 q 4 -7 10 -20 z";
                } else if (this.hand === 1) {
                    return "m 11 15 a 1 1 1 0 0 -22 10 q 4 8 32 10 q -4 -7 -10 -20 z";
                }
                return 0;
            }
        },
        watch: {
            editing(newValue) {
                if (!newValue) {
                    this.$root.$emit('unSummonContextual');
                }
            }
        }
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