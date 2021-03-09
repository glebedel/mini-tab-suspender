const TAB_TIMEOUT_HOURS = 2;
const HOURS_TO_MS = (hours) => hours * 60 * 60 * 1000;
const LOG_PREFIX = `Tampermonkey Tab Suspender: `;
const renderSuspendedElement = () => `<h1>Tab suspended. Refresh to restore the tab.</h1>`;
let timeout = null;
console.log(`${LOG_PREFIX}script running`);
window.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        startSuspendTimer();
    }
});
function suspendTab() {
    if (doNotSuspend()) {
        console.log(`${LOG_PREFIX}Tab not suspendable. Restart Tab Suspension timer!`);
        startSuspendTimer();
    }
    else {
        console.log(`${LOG_PREFIX}Suspend Tab!`);
        window.location.href = 'about:blank';
        document.write(`${renderSuspendedElement()}`);
    }
}
function startSuspendTimer() {
    if (timeout !== null) {
        clearTimeout(timeout);
    }
    console.log(`${LOG_PREFIX}Tab Suspension ${TAB_TIMEOUT_HOURS}h timer started!`);
    timeout = setTimeout(suspendTab, HOURS_TO_MS(TAB_TIMEOUT_HOURS));
}
function doNotSuspend() {
    return isMediaPlaying();
}
function isMediaPlaying() {
    var _a;
    const mediaElems = Array.prototype.slice.call(document.querySelectorAll('audio,video'));
    const mediaElemPlaying = mediaElems.some((elem) => elem.duration > 0 && !elem.paused);
    return mediaElemPlaying || ((_a = navigator.mediaSession) === null || _a === void 0 ? void 0 : _a.playbackState) === 'playing';
}
