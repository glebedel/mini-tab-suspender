const TAB_TIMEOUT_HOURS = 2;
const HOURS_TO_MS = (hours: number) => hours * 60 * 60 * 1000;

const LOG_PREFIX = `Tampermonkey Tab Suspender: `;

// HTML that will be written to the about:blank page when the tab is effectively suspended
const renderSuspendedElement = () => `<h1>Tab suspended. Refresh to restore the tab.</h1>`;

// Variable declared in scope to be able to clear the timeout after it's started
let timeout: null | number = null;

console.log(`${LOG_PREFIX}script running`);

// Start the suspension timer for the tab once it loses focus
window.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    startSuspendTimer();
  }
});

function attemptTabSuspension() {
  if (doNotSuspend()) {
    // if the tab should not be suspended for any reason we reset the timer.
    console.log(`${LOG_PREFIX}Tab not suspendable. Restart Tab Suspension timer!`);
    startSuspendTimer();
  } else {
    suspendTab();
  }
}

function suspendTab() {
  console.log(`${LOG_PREFIX}Suspend Tab!`);
  window.location.href = 'about:blank';
  document.write(`${renderSuspendedElement()}`);
}

function startSuspendTimer() {
  if (timeout !== null) {
    clearTimeout(timeout);
  }
  console.log(`${LOG_PREFIX}Tab Suspension ${TAB_TIMEOUT_HOURS}h timer started!`);
  timeout = setTimeout(attemptTabSuspension, HOURS_TO_MS(TAB_TIMEOUT_HOURS));
}

/**
 * @returns true if tab can be suspended
 */
function doNotSuspend() {
  return isMediaPlaying();
}

/**
 *
 * @returns whether or not an audio or video element is playing in tab
 */
function isMediaPlaying() {
  const mediaElems: HTMLMediaElement[] = Array.prototype.slice.call(document.querySelectorAll('audio,video'));
  const mediaElemPlaying = mediaElems.some((elem) => elem.duration > 0 && !elem.paused);
  return mediaElemPlaying || navigator.mediaSession?.playbackState === 'playing';
}
