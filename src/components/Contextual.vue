<template>
    <transition name="fade">
        <div class="contextual-container" v-show="isVisible" :style="{ left: left + 'px', top: top + 'px'}">
            <div class="contextual">
                <div class="bubble">
                    <div v-if="!isTitle" class="hands">
                        <div class="hand" @click="changeHand(-1)">Left</div>
                        <div class="hand neutral" @click="changeHand(0)">Neutral</div>
                        <div class="hand" @click="changeHand(1)">Right</div>
                    </div>
                    <div class="colors bubble-component">
                        <div>
                            <div v-for="col in colors" :style="{backgroundColor: col}" :key="col"
                                 @click="changeColor(col)"></div>
                        </div>
                        <div>
                            <div v-for="col in colors2" :style="{backgroundColor: col}" :key="col"
                                 @click="changeColor(col)"></div>
                        </div>
                    </div>
                    <div class="options bubble-component" @click="deleteCurrent">
                        <svg width="32px" height="32px" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fill-rule="evenodd"
                                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                    </div>
                </div>
                <div class="triangle" :style="{left: this.x - this.left - 7 + 'px'}"></div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: "Contextual",
        data() {
            return {
                isVisible: false,
                x: 0,
                y: 0,

                forceRecompute: 0, // ?
                current: null,
                colors: [
                    '#000000',
                    '#FF5722',
                    '#FFB300'
                ],
                colors2: [
                    '#42b983',
                    '#b8a3ff',
                    '#3eddff'
                ]
            }
        },
        methods: {
            summonContextual(current) {
                if (current) {
                    let rect = current.$el.getBoundingClientRect();
                    this.x = rect.left + rect.width / 2;
                    this.y = rect.top;
                    this.current = current;
                    this.isVisible = true;
                } else { // apply for selection
                    this.current = this.$store.state.selected;
                    if (this.current.length >= 1) {
                        let minX = 99999999;
                        let maxX = -99999999;
                        let minY = 99999999;
                        for (let key of this.current) {
                            let b = key.$el.getBoundingClientRect();
                            let x = b.left + b.width / 2;
                            if (x > maxX) {
                                maxX = x;
                            }
                            if (x < minX) {
                                minX = x;
                            }
                            if (b.top < minY) {
                                minY = b.y;
                            }
                        }
                        this.x = (minX + maxX) / 2;
                        this.y = minY;
                        this.isVisible = true;
                    }
                }
            },
            unSummonContextual() {
                //this.current = null;
                this.isVisible = false;
            },
            deleteCurrent() {
                if (Array.isArray(this.current)) {
                    for (let c of this.current) {
                        c.$refs.finger.delete();
                    }
                } else {
                    this.current.delete();
                }
                this.unSummonContextual();
                this.$root.$emit('unselectAll');
            },
            changeColor(col) {
                if (Array.isArray(this.current)) {
                    for (let c of this.current) {
                        c.$refs.finger.changeColor(col);
                    }
                } else {
                    this.current.changeColor(col);
                }
            },
            changeHand(hand) {
                if (Array.isArray(this.current)) {
                    for (let c of this.current) {
                        c.$refs.finger.changeHand(hand);
                    }
                } else {
                    this.current.changeHand(hand);
                }
            }
        },
        computed: {
            left() {
                //manually computed bubble width because it won't update correctly when not visible
                return clamp(this.x - 80, 0, window.innerWidth - 160);
            },
            top() {
                return this.y - 60;
            },
            isTitle() {
                return !Array.isArray(this.current)
                    && this.current !== null
                    && this.current.$options._componentTag === "Title";
            }
        },
        mounted() {
            this.$root.$on('summonContextual', this.summonContextual);
            this.$root.$on('unSummonContextual', this.unSummonContextual);
        }
    }

    function clamp(v, min, max) {
        return Math.max(Math.min(v, max), min);
    }
</script>

<style scoped>

    .contextual-container {
        display: inline-block;
        position: absolute;
    }

    .contextual {
        display: inline-block;
        position: relative;
    }

    .bubble {
        background-color: #323334;
        color: white;
        display: inline-block;
        padding: 3px;
        border-radius: 10px;
    }

    .triangle {
        width: 0;
        height: 0;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-top: 8px solid #323334;
        left: calc(50% - 7px);
        position: absolute;
    }

    .colors {
        display: inline-block;
        vertical-align: middle;
        border-right: 1px solid #76777B;
    }

    .colors div {
        height: 17px;
        margin: 5px 0;
    }

    .colors div div {
        width: 15px;
        height: 15px;
        border-radius: 100%;
        margin: 0 5px;
        display: inline-block;
        border: 1px solid white;
        cursor: pointer;
    }

    .options {
        display: inline-block;
        vertical-align: middle;
        height: 32px;
        cursor: pointer;

    }

    .bubble-component {
        padding: 0 10px;
    }

    .hands {
        border-bottom: 1px solid #76777B;
    }

    .hand {
        width: 30%;
        display: inline-block;
        text-align: center;
        cursor: pointer;
    }

    .hand.neutral {
        border-right: 1px solid #76777B;
        border-left: 1px solid #76777B;
        width: 40%;
    }


    .fade-enter-active {
        animation: fade-animation 0.5s;
    }

    .fade-leave-active {
        animation: fade-animation 0.3s reverse;
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