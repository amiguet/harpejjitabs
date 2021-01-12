<template>
    <div>
        <md-drawer :md-active.sync="menuVisible" md-persistent="mini" :class="{smaller: isSmaller}">
            <md-list>
                <md-list-item @click="toggleMenu" title="Menu">
                    <font-awesome-icon icon="bars"/>
                    <span class="md-list-item-text">Harpejji Tabs</span>
                </md-list-item>
                <md-list-item @click="editZone" title="Reframe (R)">
                    <font-awesome-icon icon="expand"/>
                    <span class="md-list-item-text">Reframe</span>
                </md-list-item>

                <md-list-item @click="newTablature" title="New (Ctrl+N)">
                    <md-menu md-size="small" :md-offset-x="100" :md-offset-y="-96" :md-align-trigger="true" :md-active.sync="showHarpejjiMenu">
                            <font-awesome-icon icon="file"/>
                            <span class="md-list-item-text">New</span>
                        <md-menu-content>
                            <md-menu-item @click="changeHarpejji('U12')">U12</md-menu-item>
                            <md-menu-item @click="changeHarpejji('G16')">G16</md-menu-item>
                            <md-menu-item @click="changeHarpejji('K24')">K24</md-menu-item>
                        </md-menu-content>
                    </md-menu>
                </md-list-item>

                <!--                    <md-menu md-size="small" :md-offset-x="100" :md-offset-y="-96" :md-align-trigger="true" :md-active.sync="showHarpejjiMenu">
                        <md-list-item @click="newTablature" title="New (Ctrl+N)">
                            <font-awesome-icon icon="file"/>
                            <span class="md-list-item-text">New</span>
                        </md-list-item>
                        <md-menu-content>
                            <md-menu-item @click="changeHarpejji('U12')">U12</md-menu-item>
                            <md-menu-item @click="changeHarpejji('G16')">G16</md-menu-item>
                            <md-menu-item @click="changeHarpejji('K24')">K24</md-menu-item>
                        </md-menu-content>
                    </md-menu>-->


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

                <md-list-item @click="save" title="Save (Ctrl+S)">
                    <font-awesome-icon icon="file-download" size="lg"/>
                    <span class="md-list-item-text">Save</span>
                </md-list-item>

                <md-list-item @click="load" title="Load (Ctrl+O)">
                    <font-awesome-icon icon="file-upload" size="lg"/>
                    <span class="md-list-item-text">Load</span>
                </md-list-item>

                <md-list-item>
                    <md-divider></md-divider>
                </md-list-item>

                <md-list-item @click="playChord" title="Play simultaneously (P)">
                    <font-awesome-icon icon="play" size="lg"/>
                    <span class="md-list-item-text">Play simultaneously</span>
                </md-list-item>

                <md-list-item @click="playChordArpeggiate" title="Play sequentially (S)">
                    <font-awesome-icon icon="music" size="lg"/>
                    <span class="md-list-item-text">
                        <label for="playDelay">Play sequentially ({{ playDelay }}s)</label>
                        <input type="range" min="0.05" max="0.5" step="0.01" v-model="playDelay" style="width: 100%;" id="playDelay"/></span>
                </md-list-item>
                <md-list-item>
                    <md-divider></md-divider>
                </md-list-item>

                <md-list-item @click="showNumbers = !showNumbers" title="Show frets numbers (F)">
                    <span class="stack">
                        <font-awesome-icon icon="list-ol" size="lg"/>
                        <font-awesome-icon v-if="!showNumbers" icon="slash" size="lg"/>
                    </span>
                    <span class="md-list-item-text">Show frets numbers</span>
                </md-list-item>

                <md-list-item @click="showNotes = !showNotes" title="Show notes name (N)">
                    <span class="stack">
                        <span class="text-icon">C4</span>
                        <font-awesome-icon v-if="!showNotes" icon="slash" size="lg"/>
                    </span>
                    <span class="md-list-item-text">Show notes name</span>
                </md-list-item>

                <md-list-item @click="playNotes = !playNotes" title="Play notes on click (M)">
                    <font-awesome-icon :icon="playNotes ? 'volume-up' : 'volume-mute'" size="lg"/>
                    <span class="md-list-item-text">Play notes on click</span>
                </md-list-item>
            </md-list>
        </md-drawer>
    </div>
</template>


<script>
    import * as Exportation from '../js/exportation.js'
    import * as Shortcut from '../js/shortcuts.js'

    export default {
        name: "Toolsbar",
        data: function () {
            return {
                menuVisible: false,
                isSmaller: false,
                playDelay: 0.3,
                showHarpejjiMenu: false
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
                    try {
                        let data = JSON.parse(fileReader.result);
                        this.$root.$emit('loadData', data);
                        e.target.value = "";
                    } catch (e) {
                        alert("Error parsing the file");
                    }
                };

                fileReader.readAsText(e.target.files[0]);
            },
            load() {
                document.getElementById('loadFile').click();
            },
            downloadSVG() {
                Exportation.downloadSVG(this.$store.state.title || "untitled", this);
            },
            downloadPNG() {
                Exportation.downloadPNG(this.$store.state.title || "untitled", this);
            },
            changeIsTooSmall(isTooSmall) {
                this.isSmaller = isTooSmall
            },
            playChord() {
                this.$root.$emit('setupChord', 0);
            },
            playChordArpeggiate() {
                this.$root.$emit('setupChord', this.playDelay);
            },
            newTablature(e) {
                if (this.$store.state.hasBeenModified) {
                    if (!confirm("Some change has not been saved, are you sure you want to start a new document ?"))
                        return;
                }
                this.$root.$emit('deleteKeys');
                this.showHarpejjiMenu = true;
                this.$store.commit('hasBeenSaved');
            },
            changeHarpejji(h) {
                this.$store.commit('changeHarpejji', h);
            }
        },
        computed: {
            showNumbers: {
                get() {
                    return this.$store.state.showNumbers;
                },
                set(value) {
                    return this.$store.commit('updateShowNumbers', value);
                }
            },
            showNotes: {
                get() {
                    return this.$store.state.showNotes;
                },
                set(value) {
                    return this.$store.commit('updateShowNotes', value);
                }
            },
            playNotes: {
                get() {
                    return this.$store.state.playNotes;
                },
                set(value) {
                    return this.$store.commit('updatePlayNotes', value);
                }
            }
        },
        mounted() {
            this.$root.$on('isTooSmall', this.changeIsTooSmall);
            document.getElementById('loadFile').addEventListener('change', this.readFile);
            Shortcut.on("R", this.editZone);
            Shortcut.on("P", this.playChord);
            Shortcut.on("S", this.playChordArpeggiate);
            Shortcut.on("M", () => this.playNotes = !this.playNotes);
            Shortcut.on("N", () => this.showNotes = !this.showNotes);
            Shortcut.on("F", () => this.showNumbers = !this.showNumbers);
            Shortcut.on("S", this.save, true);
            Shortcut.on("O", this.load, true);
            Shortcut.on("N", this.newTablature, true);

        }
    }
</script>


<style scoped>
    .md-drawer {
        width: 230px;
        max-width: calc(100vw - 125px);
    }

    .md-list-item-content > *:first-child:not(.md-divider):not(.md-menu) {
        margin-right: 20px;
        width: 24px;

    }



    .md-menu > *:first-child:not(.md-divider):not(.md-menu) {
        margin-right: 20px;
        width: 24px;
    }

    .stack {
        position: relative;
        display: block;
        width: 24px;
        height: 24px;
        margin-right: 0;
    }

    .text-icon {
        font-size: 17px;
    }

    .stack > * {
        position: absolute;
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
    .smaller:not(.md-active) ul div:not(:first-child) {
        display: none;
    }

    .smaller:not(.md-active) ul, .smaller:not(.md-active) {
        background-color: unset !important;
        border: none !important;
    }

    .md-divider {
        width: 100%;
    }

    .md-menu {
        display: flex;
        align-items: center;
        min-height: 48px;
        justify-content: space-between;
        width: 100%;
        overflow: hidden;
        height: 48px;
    }
</style>

<style>
    .md-list-item-container:not(.md-list-item-default):not([disabled])>.md-list-item-content {
        height: 48px;
    }
</style>