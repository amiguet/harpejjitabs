<template>
    <svg height="1000">
        <g transform="translate(30, 30) scale(2)">
            <g v-for="(dominantBaselineAttr, j) in dominantBaselineAttrs" :transform="'translate(50, ' + j * 30 + ')'">
                <text x="-20px" text-anchor="end" font-size="6px">{{dominantBaselineAttr}}</text>
                <g v-for="(character, i) in characters" :transform="'translate(' + i * 30 + ')'">
                    <circle r="12" fill="black"></circle>
                    <text
                            style="fill: white; font-size: 16px;font-family: Helvetica, Arial, sans-serif;"
                            text-anchor="middle"
                            :dominant-baseline="dominantBaselineAttr">{{character}}
                    </text>
                </g>
            </g>

            <g v-for="(alignmentBaselineAttrs, j) in dominantBaselineAttrs" :transform="'translate(0, ' + (300 + j * 30) + ')'" style="display: none;">
                <g v-for="(character, i) in characters" :transform="'translate(' + i * 30 + ')'">
                    <circle r="12" fill="black"></circle>
                    <text
                            style="fill: white; font-size: 16px;font-family: Helvetica, Arial, sans-serif;"
                            text-anchor="middle"
                            :alignment-baseline="alignmentBaselineAttrs">{{character}}
                    </text>
                </g>
            </g>
        </g>
    </svg>
</template>

<script>
    export default {
        name: "Testing.vue",
        data: function () {
            return {
                characters: ['g', 'A', '2'],
                dominantBaselineAttrs: ["auto", "text-bottom", "alphabetic", "ideographic", "middle", "central", "mathematical", "hanging", "text-top"],
                alignmentBaselineAttrs: ["auto", "baseline", "before-edge", "text-before-edge", "middle", "central", "after-edge", "text-after-edge", "ideographic", "alphabetic", "hanging", "mathematical", "top", "center", "bottom"]
            }
        }
    }
</script>

<style scoped>

</style>