let keyDict = [];

export function on(keyboard, f, needMetaKey = false) {
    keyDict[keyboard.toLowerCase()] = {"f": f, "needMetaKey": needMetaKey};
}

window.addEventListener('keydown', e => {


    if (e.key.toLowerCase() in keyDict) {
        let needMetaKey = keyDict[e.key.toLowerCase()].needMetaKey;

        if (needMetaKey === (e.metaKey || e.ctrlKey)) {
            console.log("save");
            keyDict[e.key.toLowerCase()].f();
            e.preventDefault();
        }
    }
});