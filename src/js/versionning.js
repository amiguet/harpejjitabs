export function loadData(data, that) {
    let version = data.v;
    loadVersion[version](data, that)
}

let loadVersion = {
    "1.0": function(data, that) {
        that.editingZone = false;
        that.$store.dispatch('changeTitle', data.t);
        that.$store.dispatch('changeZone', {
                'x1': data.x1,
                'y1': data.y1,
                'x2': data.x2,
                'y2': data.y2,
            }
        );
        setTimeout(() => {
            for (let [i, key] of that.$refs.keys.entries()) {
                if (data.k[i] !== 0) {
                    key.isVisible = true;
                    key.$refs.finger.value = data.k[i].v;
                    key.$refs.finger.color = data.k[i].c;
                    key.$refs.finger.editing = false;
                }
            }
        }, 0);
    },
    "1.1": function(data, that) {
        that.editingZone = false;
        that.$store.dispatch('changeTitle', data.t.v);
        that.$refs.title.color = data.t.c;
        that.$store.dispatch('changeZone', {
                'x1': data.x1,
                'y1': data.y1,
                'x2': data.x2,
                'y2': data.y2,
            }
        );
        setTimeout(() => {
            that.$root.$emit('resetTablature');
            for (let [i, key] of that.$refs.keys.entries()) {
                if (data.k[i] !== 0) {
                    key.isVisible = true;
                    key.$refs.finger.value = data.k[i].v;
                    key.$refs.finger.color = data.k[i].c;
                    key.$refs.finger.editing = false;
                }
            }
        }, 0);
    }
}