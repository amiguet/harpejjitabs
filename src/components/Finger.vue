<template>
    <transition name="fade">
        <g v-if="isVisible">
            <circle r="12" cy="20" :fill="color" @click.stop="startEdit"></circle>
            <text y="21" style="fill: white; font-size: 16px;font-family: Helvetica, Arial, sans-serif;" text-anchor="middle" dominant-baseline="middle" @click.stop="startEdit">{{ value }}</text>
            <transition name="fade">
                <foreignObject height="24" width="24" x="-12" :y="-12 + 20"  v-if="editing" @click.stop="" ref="fo">
                    <input type="text" v-model="value" @blur.prevent.stop="doneEdit" @keyup.enter="doneEdit" @keydown.delete="deleteDown" ref="textEdit" />
                </foreignObject>
            </transition>
        </g>
    </transition>
</template>

<script>
    export default {
        name: "Finger",
        props: [
            'isVisible'
        ],
        data() {
            return {
                value: '1',
                color: '#000000',
                editing: false,
                animate: true
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
                    this.editing = false;
                    this.$emit('deleteFinger');
                }
            },
            delete() {
                this.editing = false;
                this.$emit('deleteFinger');
            },
            changeColor(color) {
                this.color = color;
            }
        },
        computed: {
            animationName() {
                return this.animate ? "fade" : "disable";
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