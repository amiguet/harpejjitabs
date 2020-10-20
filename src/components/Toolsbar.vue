<template>
    <div>
        <md-drawer :md-active.sync="menuVisible" md-persistent="mini" :class="{smaller: isSmaller}">
            <md-list>
                <md-list-item @click="toggleMenu">
                    <font-awesome-icon icon="bars"/>
                    <span class="md-list-item-text">Harpejji Tabs</span>
                </md-list-item>
                <md-list-item @click="editZone">
                    <font-awesome-icon icon="expand"/>
                    <span class="md-list-item-text">Reframe</span>
                </md-list-item>

                <md-list-item @click="downloadPNG">
                    <font-awesome-icon icon="file-image" size="lg"/>
                    <span class="md-list-item-text">Download png</span>
                </md-list-item>

                <md-list-item @click="downloadSVG">
                    <font-awesome-icon icon="file-code" size="lg"/>
                    <span class="md-list-item-text">Download SVG</span>
                </md-list-item>

                <md-list-item @click="save">
                    <font-awesome-icon icon="file-download" size="lg"/>
                    <span class="md-list-item-text">Export</span>
                </md-list-item>

                <md-list-item @click="load">
                    <font-awesome-icon icon="file-upload" size="lg"/>
                    <span class="md-list-item-text">Import</span>
                </md-list-item>
            </md-list>
        </md-drawer>
    </div>
</template>

<script>
    export default {
        name: "Toolsbar",
        data: function () {
            return {
                menuVisible: false,
                isSmaller: false
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
            load() {
                document.getElementById('loadFile').click();
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
            downloadSVG() {

            },
            downloadPNG() {

            },
            changeIsTooSmall(isTooSmall) {
                this.isSmaller = isTooSmall
            }
        },
        mounted() {
            this.$root.$on('isTooSmall', this.changeIsTooSmall);
        }
    }
</script>


<style scoped>
    .md-drawer {
        width: 230px;
        max-width: calc(100vw - 125px);
    }

    .md-list-item svg {
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


</style>