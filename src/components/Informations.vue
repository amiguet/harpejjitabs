<template>
    <md-dialog :md-active.sync="showDialog">
        <md-dialog-title>Harpejji® Tabs</md-dialog-title>
        <md-dialog-content>
            <div class="dialog-content">
                <p>Harpejji® Tabs is a web app allowing you to create and share Harpejji® Tablatures.</p>
                <p>
                    Select the Harpejji® size by creating a new document
                    then select your workzone by clicking on Reframe.
                </p>
                <h3>Shortcuts</h3>
                <ul>
                    <li>
                        <span>R</span> Set note range
                    </li>
                    <li>
                        <span>Ctrl+S</span> Save
                    </li>
                    <li>
                        <span>Ctrl+O</span> Load
                    </li>
                    <li>
                        <span>P</span> Play simultaneously
                    </li>
                    <li>
                        <span>S</span> Play sequentially
                    </li>
                    
                    <li>
                        <span>F</span> Show frets and strings numbers
                    </li>
                    <li>
                        <span>N</span> Show notes names
                    </li>
                    <li>
                        <span>M</span> Play note on click
                    </li>
                </ul>
                <h3>Credit</h3>
                <div style="text-align: center">
                    <p>Developped by Nicolas Laoun</p>
                    <p>Supervised by <a href="http://www.matthieuamiguet.ch/" target="_blank">Matthieu Amiguet</a> and
                        David Grunenwald</p>

                    <a href="https://www.marcodi.com/" target="_blank">
                        <img src="img/logo_Marcodi.webp" alt="Logo Marcodi" width="300px">
                    </a>
                    <a href="https://www.he-arc.ch/" target="_blank">
                        <img src="img/logo_HE-Arc.png" alt="Logo HE-Arc" width="200px">
                    </a>
                    <a href="https://www.lescheminsdetraverse.net/" target="_blank">
                        <img src="img/logo_lescheminsdetraverse.svg" alt="Logo Les Chemins de Traverse" width="200px">
                    </a>
                </div>
            </div>
        </md-dialog-content>
        <md-dialog-actions>
            <div class="btn-close" @click="showDialog = false">Close</div>
        </md-dialog-actions>
    </md-dialog>
</template>

<script>
    export default {
        name: "Informations",
        data() {
            return {
                showDialog: false
            }
        },
        mounted() {
            // Listener when the user click to show the menu
            this.$root.$on('displayInformations', () => {
                this.showDialog = true;
            })
        }
    }
</script>

<style scoped>
    li span {
        width: 50px;
        display: inline-block;
    }

    ul {
        list-style-type: none;
    }

    @media screen and (min-width: 600px) {
        .dialog-content {
            width: 500px;
        }
    }


    .btn-close {
        padding: 12px;
        color: #448aff;
        font-weight: 500;
        cursor: pointer;
    }

    img {
        margin: 10px;
    }
</style>