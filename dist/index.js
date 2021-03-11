const TAB_TIMEOUT_HOURS = 2;
const HOURS_TO_MS = (hours) => hours * 60 * 60 * 1000;
const LOG_PREFIX = `Tampermonkey Tab Suspender: `;
var DATA_PARAMETERS;
(function (DATA_PARAMETERS) {
    DATA_PARAMETERS["title"] = "title";
})(DATA_PARAMETERS || (DATA_PARAMETERS = {}));
function initTabSuspension() {
    if (window.top !== window) {
        return;
    }
    let timeout = null;
    console.log(`${LOG_PREFIX}script running`);
    window.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            startSuspendTimer();
        }
        else if (timeout !== null) {
            clearTimeout(timeout);
        }
    });
    function attemptTabSuspension() {
        if (doNotSuspend()) {
            console.log(`${LOG_PREFIX}Tab not suspendable. Restart Tab Suspension timer!`);
            startSuspendTimer();
        }
        else {
            suspendTab();
        }
    }
    function suspendTab() {
        console.log(`${LOG_PREFIX}Suspend Tab!`);
        const oldDocumentTitle = document.title;
        window.location.href = `about:blank`;
        document.write(`${renderSuspendedElement(oldDocumentTitle)}`);
        document.title = `⏸ ${oldDocumentTitle}`;
        window.addEventListener('click', () => location.reload());
    }
    function startSuspendTimer() {
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        console.log(`${LOG_PREFIX}Tab Suspension ${TAB_TIMEOUT_HOURS}h timer started!`);
        timeout = setTimeout(attemptTabSuspension, HOURS_TO_MS(TAB_TIMEOUT_HOURS));
    }
    function doNotSuspend() {
        return !document.hidden || isMediaPlaying();
    }
    function isMediaPlaying() {
        var _a;
        const mediaElems = Array.prototype.slice.call(document.querySelectorAll('audio,video'));
        const mediaElemPlaying = mediaElems.some((elem) => elem.duration > 0 && !elem.paused);
        return mediaElemPlaying || ((_a = navigator.mediaSession) === null || _a === void 0 ? void 0 : _a.playbackState) === 'playing';
    }
    function renderSuspendedElement(tabTitle) {
        return `<h1>${tabTitle}</h1><h2>Tab suspended. Refresh or click to restore the tab.</h2>`;
    }
}
initTabSuspension();
