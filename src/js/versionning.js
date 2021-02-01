/**
 * Load JSON data to the tablature
 * @param data the json data
 * @param that the tablature
 */
export function loadData(data, that) {
    //select the correct version
    let version = data.v;
    try {
        loadVersion[version](data, that)
    } catch (e) {
        alert("Error parsing the file");
    }
}

// Object containing a function for each version
// Because each version has some differences, it need to be parse differently
// Assure backward compatibility
let loadVersion = {
    "1.0": function (data, that) {
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
            that.calculateSize();
        }, 0);
    },
    "1.1": function (data, that) {
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
            that.$root.$emit('deleteKeys');
            for (let [i, key] of that.$refs.keys.entries()) {
                if (data.k[i] !== 0) {
                    key.isVisible = true;
                    key.$refs.finger.value = data.k[i].v;
                    key.$refs.finger.color = data.k[i].c;
                    key.$refs.finger.editing = false;
                }
            }
            that.calculateSize();
        }, 0);
    },
    "1.2": function (data, that) {
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
            that.$root.$emit('deleteKeys');
            for (let [i, key] of that.$refs.keys.entries()) {
                if (data.k[i] !== 0) {
                    key.isVisible = true;
                    key.$refs.finger.value = data.k[i].v;
                    key.$refs.finger.color = data.k[i].c;
                    key.$refs.finger.hand = data.k[i].h;
                    key.$refs.finger.editing = false;
                }
            }
            that.calculateSize();
        }, 0);
    },
    "1.3": function (data, that) {
        that.editingZone = false;
        that.$store.dispatch('changeZone', {
                'x1': data.x1,
                'y1': data.y1,
                'x2': data.x2,
                'y2': data.y2,
            }
        );
        that.$store.commit('changeHarpejji', data.s);
        setTimeout(() => {
            that.$root.$emit('deleteKeys');
            for (let [i, key] of that.$refs.keys.entries()) {
                if (data.k[i] !== 0) {
                    key.isVisible = true;
                    key.$refs.finger.value = data.k[i].v;
                    key.$refs.finger.color = data.k[i].c;
                    key.$refs.finger.hand = data.k[i].h;
                    key.$refs.finger.editing = false;
                }
            }
            that.$store.dispatch('changeTitle', data.t.v);
            that.$refs.title.color = data.t.c;
            that.calculateSize();
        }, 0);
    }
};