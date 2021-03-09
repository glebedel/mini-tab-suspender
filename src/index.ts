const TAB_TIMEOUT_HOURS = 2;
const HOURS_TO_MS = (hours: number) => hours * 60 * 60 * 1000;

const LOG_PREFIX = `Tampermonkey Tab Suspender: `;
const renderSuspendedElement = () => `<h1>Tab suspended. Refresh to restore the tab.</h1>`;

console.log(`${LOG_PREFIX}script running`);

function suspendTab() {
  console.log(`${LOG_PREFIX}Suspend Tab!`);
  window.location.href = 'about:blank';
  document.write(`${renderSuspendedElement()}`);
}

let timeout: null | number = null;
window.addEventListener('visibilitychange', () => {
  if (document.hidden && navigator.mediaSession?.playbackState !== 'playing') {
    timeout = setTimeout(suspendTab, HOURS_TO_MS(TAB_TIMEOUT_HOURS));
  } else if (timeout !== null) {
    clearTimeout(timeout);
  }
});

function isMediaPlaying() {
  const mediaElems: HTMLMediaElement[] = Array.prototype.slice.call(document.querySelectorAll('audio,video'));
  const mediaElemPlaying = mediaElems.some((elem) => elem.duration > 0 && !elem.paused);
  return mediaElemPlaying || navigator.mediaSession?.playbackState === 'playing';
}