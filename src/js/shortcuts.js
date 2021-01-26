let keyDict = [];

/**
 * Custom "library" to be able to easily create keyboard shortcut
 * @param {String} keyboard the key (string)
 * @param {Function} f callback
 * @param {Boolean} needMetaKey true if ctrl|cmd need to be pressed for this shortcut
 */
export function on(keyboard, f, needMetaKey = false) {
    if (!(keyboard.toLowerCase() in keyDict)) {
        keyDict[keyboard.toLowerCase()] = [];
    }
    keyDict[keyboard.toLowerCase()].push({"f": f, "needMetaKey": needMetaKey});
}

window.addEventListener('keydown', e => {

    if (e.key.toLowerCase() in keyDict) {
        for (let s of keyDict[e.key.toLowerCase()]) {
            let needMetaKey = s.needMetaKey;

            if (needMetaKey === (e.metaKey || e.ctrlKey)) {
                s.f();
                e.preventDefault();
            }
        }
    }
});