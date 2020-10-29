<template>
    <div>
        <md-drawer :md-active.sync="menuVisible" md-persistent="mini" :class="{smaller: isSmaller}">
            <md-list>
                <md-list-item @click="toggleMenu" title="Menu">
                    <font-awesome-icon icon="bars"/>
                    <span class="md-list-item-text">Harpejji Tabs</span>
                </md-list-item>
                <md-list-item @click="editZone" title="Reframe">
                    <font-awesome-icon icon="expand"/>
                    <span class="md-list-item-text">Reframe</span>
                </md-list-item>

                <md-list-item>
                    <md-divider></md-divider>
                </md-list-item>

                <md-list-item @click="downloadPNG" title="Export to PNG">
                    <font-awesome-icon icon="file-image" size="lg"/>
                    <span class="md-list-item-text">Export to PNG</span>
                </md-list-item>

                <md-list-item @click="downloadSVG" title="Export to SVG">
                    <font-awesome-icon icon="file-code" size="lg"/>
                    <span class="md-list-item-text">Export to SVG</span>
                </md-list-item>

                <md-list-item>
                    <md-divider></md-divider>
                </md-list-item>

                <md-list-item @click="save" title="Export">
                    <font-awesome-icon icon="file-download" size="lg"/>
                    <span class="md-list-item-text">Save</span>
                </md-list-item>

                <md-list-item @click="load" title="Import">
                    <font-awesome-icon icon="file-upload" size="lg"/>
                    <span class="md-list-item-text">Load</span>
                </md-list-item>

                <md-list-item>
                    <md-divider></md-divider>
                </md-list-item>

                <md-list-item @click="playChord" title="Play the chord">
                    <font-awesome-icon icon="play" size="lg"/>
                    <span class="md-list-item-text">Play the chord</span>
                </md-list-item>

                <md-list-item @click="playChordArpeggiate" title="Play the chord">
                    <font-awesome-icon icon="play" size="lg"/>
                    <span class="md-list-item-text">Play the chord Arpeggiate</span>
                </md-list-item>

                <md-list-item>
                    <md-divider></md-divider>
                </md-list-item>

                <md-list-item title="Show frets numbers">
                    <md-switch v-model="showNumbers" class="md-primary"></md-switch>
                    <span class="md-list-item-text">Show frets numbers</span>
                </md-list-item>
            </md-list>
        </md-drawer>
    </div>
</template>


<script>
    import * as Exportation from '../js/exportation.js'

    export default {
        name: "Toolsbar",
        data: function () {
            return {
                menuVisible: false,
                isSmaller: false,
                showNumbers: false
            }
        },
        methods: {
            toggleMenu() {
                this.menuVisible = !this.menuVisible;
            },
            editZone() {
                this.$root.$emit('editZone');
                this.menuVisible = false;
            },
            save() {
                this.$root.$emit('save');
            },
            readFile(e) {
                let fileReader = new FileReader();
                fileReader.onload = () => {
                    let data = JSON.parse(fileReader.result);
                    this.$root.$emit('loadData', data);
                    e.target.value = "";
                };

                fileReader.readAsText(e.target.files[0]);
            },
            load() {
                document.getElementById('loadFile').click();
            },
            downloadSVG() {
                setTimeout(() => {  // To avoid having text field in the SVG (because of the transition animation)
                    Exportation.downloadSVG(this.$store.state.title || "untitled", this);
                }, 200);
            },
            downloadPNG() {
                setTimeout(() => {  // To avoid having text field in the SVG (because of the transition animation)
                    Exportation.downloadPNG(this.$store.state.title || "untitled", this);
                }, 200);
            },
            changeIsTooSmall(isTooSmall) {
                this.isSmaller = isTooSmall
            },
            playChord() {
                this.$root.$emit('setupChord', 0);
            },
            playChordArpeggiate() {
                this.$root.$emit('setupChord', 0.1);
            }
        },
        watch: {
            showNumbers(value) {
                this.$root.$emit('changeShowNumbers', value);
            }
        },
        mounted() {
            this.$root.$on('isTooSmall', this.changeIsTooSmall);
            document.getElementById('loadFile').addEventListener('change', this.readFile);
        }
    }
</script>


<style scoped>
    .md-drawer {
        width: 230px;
        max-width: calc(100vw - 125px);
    }

    .md-list-item-content>*:first-child:not(.md-divider) {
        margin-right: 20px;
        width: 24px;
    }

    .md-drawer {
        transform: initial !important;
    }

    .md-drawer.md-persistent-mini.md-active {
        position: absolute !important;
    }

    .smaller:not(.md-active) {
        bottom: initial !important;
    }

    .smaller:not(.md-active) ul li:not(:first-child) {
        display: none;
    }

    .smaller:not(.md-active) ul, .smaller:not(.md-active) {
        background-color: unset !important;
        border: none !important;
    }

    .md-divider {
        width: 100%;
    }


</style>