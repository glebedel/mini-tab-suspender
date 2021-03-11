const TAB_TIMEOUT_HOURS = 6;
const HOURS_TO_MS = (hours: number) => hours * 60 * 60 * 1000;

const LOG_PREFIX = `Tampermonkey Tab Suspender: `;

enum DATA_PARAMETERS {
  title = 'title',
}

function initTabSuspension() {
  // We don't need to suspend a window that isn't the top level window/frame.
  if (window.top !== window) {
    return;
  }

  // Variable declared in scope to be able to clear the timeout after it's started
  let timeout: null | number = null;

  console.log(`${LOG_PREFIX}script running`);

  // Start the suspension timer for the tab once it loses focus
  window.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      startSuspendTimer();
      // if the tab has re-gained focus/visibility we shouldn't abort the suspension timer
    } else if (timeout !== null) {
      clearTimeout(timeout);
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
    // The about:blank redirect erases the tab title so we save it first
    const oldDocumentTitle = document.title;
    window.location.href = `about:blank`;
    // Restore the tab title and use it to render content on the blank page
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

  /**
   * @returns true if tab can be suspended
   */
  function doNotSuspend() {
    // Tab is not hidden (aka it is currently visible/focused)
    // Or a Media element (video/audio) is playing
    return !document.hidden || isMediaPlaying();
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

  // HTML that will be written to the about:blank page when the tab is effectively suspended
  function renderSuspendedElement(tabTitle: string | undefined) {
    return `<h1>${tabTitle}</h1><h2>Tab suspended. Refresh or click to restore the tab.</h2>`;
  }
}

initTabSuspension();
