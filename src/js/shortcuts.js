let keyDict = [];

export function on(keyboard, f) {
    keyDict[keyboard.toLowerCase()] = f;
}

window.addEventListener('keydown', e => {
    if (e.key.toLowerCase() in keyDict) {
        keyDict[e.key]();
    }
});