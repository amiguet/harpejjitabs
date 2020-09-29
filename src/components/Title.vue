<template>
    <g transform="translate(0, 230)">
        <rect :width="this.$parent.frets_size" height="30" @click.stop="editTitle" style="fill: transparent"></rect>
        <transition name="fade">
            <text :x="this.$parent.frets_size / 2" y="17" alignment-baseline="middle" text-anchor="middle" v-if="!editing" @click.stop="editTitle">{{ title }}</text>
        </transition>
        <transition name="fade">
            <foreignObject height="30" :width="this.$parent.frets_size" v-if="editing" @click.stop>
                <input type="text" id="title" v-model="title" @blur.prevent.stop="doneEdit" @keyup.enter="doneEdit" ref="textEdit" :width="this.$parent.frets_size" />
            </foreignObject>
        </transition>
    </g>
</template>

<script>
    export default {
        name: "Title",
        data: function() {
            return {
                title: '',
                editing: false
            }
        },
        methods: {
            editTitle() {
                this.editing = true;
                // To be able to display the keyboard on IOS, we need to focus the element on the click event.
                // We need to create a temporary input, to be able to focus it with the event
                let input = document.createElement("input");
                input.type = "text";
                input.style.opacity = "0";
                document.body.appendChild(input);
                input.focus();

                setTimeout(() => {
                    var el = this.$refs.textEdit;
                    el.focus();
                    el.select();
                    el.setSelectionRange(0, 9999); //iOS
                    document.body.removeChild(input)
                }, 0);
            },
            doneEdit() {
                this.editing = false;
                this.$store.dispatch('changeTitle', this.title);
            }
        },
        mounted() {
            this.title = this.$store.state.title;
        }
    }
</script>

<style scoped>
    input[type="text"] {
        /*width: 100px;*/
        text-align: center;
        display: block;
        height: 24px;
        margin: auto;
        font-size: initial;
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